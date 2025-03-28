import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// 特定の記事を取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // IDまたはスラッグで記事を検索
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(tag:tags(*))
      `)
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json({ error: '記事の取得中にエラーが発生しました' }, { status: 500 });
  }
}

// 記事を更新するAPI
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }
    
    // 記事の更新
    const { data: post, error: postError } = await supabase
      .from('posts')
      .update({
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || generateExcerpt(body.content),
        thumbnail_url: body.thumbnail_url,
        status: body.status,
        updated_at: new Date().toISOString(),
        published_at: body.status === 'published' && !body.published_at ? new Date().toISOString() : body.published_at,
      })
      .eq('id', id)
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }
    
    if (!post) {
      return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 });
    }
    
    // タグの処理
    if (body.tags && Array.isArray(body.tags)) {
      // 既存のタグ関連付けを削除
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', id);
      
      // 新しいタグを追加
      for (const tagName of body.tags) {
        // タグが存在するか確認
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        let tagId;
        
        // タグが存在しない場合は作成
        if (!existingTag) {
          const { data: newTag, error: tagError } = await supabase
            .from('tags')
            .insert([{ name: tagName }])
            .select()
            .single();
          
          if (tagError) continue;
          tagId = newTag.id;
        } else {
          tagId = existingTag.id;
        }
        
        // 記事とタグの関連付け
        await supabase
          .from('post_tags')
          .insert([{ post_id: id, tag_id: tagId }]);
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('記事更新エラー:', error);
    return NextResponse.json({ error: '記事の更新中にエラーが発生しました' }, { status: 500 });
  }
}

// 記事を削除するAPI
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // 記事とタグの関連付けを削除
    await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id);
    
    // 記事を削除
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json({ error: '記事の削除中にエラーが発生しました' }, { status: 500 });
  }
}

// 本文から抜粋を生成する関数
function generateExcerpt(content: string, maxLength = 150): string {
  // Markdown記法を削除
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像を削除
    .replace(/\[.*?\]\(.*?\)/g, '$1') // リンクを削除
    .replace(/#+\s(.*)/g, '$1') // 見出しを削除
    .replace(/\*\*(.*?)\*\*/g, '$1') // 太字を削除
    .replace(/\*(.*?)\*/g, '$1') // 斜体を削除
    .replace(/`(.*?)`/g, '$1') // インラインコードを削除
    .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
    .replace(/\n/g, ' ') // 改行をスペースに置換
    .trim();
  
  // 指定された長さで切り取り
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
}
