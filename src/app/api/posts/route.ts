import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// 記事一覧を取得するAPI
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(tag:tags(*))
      `)
      .order('published_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json({ error: '記事の取得中にエラーが発生しました' }, { status: 500 });
  }
}

// 新しい記事を作成するAPI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 必須フィールドの検証
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
    }
    
    // スラッグの生成（タイトルから自動生成）
    const slug = body.slug || createSlug(body.title);
    
    // 記事の保存
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          title: body.title,
          slug,
          content: body.content,
          excerpt: body.excerpt || generateExcerpt(body.content),
          thumbnail_url: body.thumbnail_url || null,
          status: body.status || 'draft',
          published_at: body.status === 'published' ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }
    
    // タグの処理
    if (body.tags && body.tags.length > 0 && post) {
      // 各タグを処理
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
          .insert([{ post_id: post.id, tag_id: tagId }]);
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json({ error: '記事の作成中にエラーが発生しました' }, { status: 500 });
  }
}

// タイトルからスラッグを生成する関数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 特殊文字を削除
    .replace(/[\s_-]+/g, '-') // スペースとアンダースコアをハイフンに置換
    .replace(/^-+|-+$/g, '') // 先頭と末尾のハイフンを削除
    .concat(`-${Date.now().toString().slice(-6)}`); // 一意性を確保するためのタイムスタンプを追加
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
