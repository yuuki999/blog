"use server";

import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { z } from 'zod';
import { supabase } from '@/utils/supabase';

// 記事データの型定義
const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published']),
  thumbnail_url: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  published_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

type PostData = z.infer<typeof postSchema>;

/**
 * ブログ関連のキャッシュを再検証するサーバーアクション
 * @param slug - 特定の記事スラッグ（オプション）
 */
export async function revalidateBlogCache(slug?: string) {
  // ダッシュボードの記事一覧を再検証
  revalidatePath('/dashboard/posts');
  
  // ブログのフロントページを再検証
  revalidatePath('/blog');
  
  // 特定の記事ページがある場合はそのページも再検証
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  
  return { success: true };
}

/**
 * 画像をアップロードし、URLを返すサーバーアクション
 * @param file - アップロードする画像ファイル
 * @param fileName - ファイル名（オプション）
 */
export async function uploadImage(file: File, fileName?: string) {
  try {
    // ファイル名が指定されていない場合は、元のファイル名を使用
    const name = fileName || file.name;
    
    // Vercel Blobにアップロード
    const blob = await put(`posts/${name}`, file, {
      access: 'public',
    });
    
    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error('画像アップロードエラー:', error);
    return { success: false, error: error.message || '画像のアップロードに失敗しました' };
  }
}

/**
 * FormDataを使用して画像と記事データを送信するサーバーアクション
 * @param formData - フォームデータ（記事データと画像ファイルを含む）
 */
// タイトルからスラッグを生成する関数
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // 特殊文字を削除
    .replace(/\s+/g, '-')      // 空白をハイフンに置換
    .replace(/^-+|-+$/g, '')   // 先頭と末尾のハイフンを削除
    .slice(0, 100);            // 長さを制限
}

// 本文から抜粋を生成する関数
function generateExcerpt(content: string, maxLength = 150): string {
  // Markdownのリンクや画像、見出しなどを削除
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 画像を削除
    .replace(/\[.*?\]\(.*?\)/g, '$1') // リンクのテキストだけを残す
    .replace(/#+\s(.*)/g, '$1') // 見出しをテキストだけに
    .replace(/\*\*(.*?)\*\*/g, '$1') // 太字をテキストだけに
    .replace(/\*(.*?)\*/g, '$1') // 斜体をテキストだけに
    .replace(/\n+/g, ' ') // 改行を空白に
    .replace(/\s+/g, ' ') // 複数の空白を一つに
    .trim();
  
  // 指定された長さに切り詰め、必要に応じて省略記号を追加
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
}

export async function savePostWithFormData(formData: FormData) {
  try {
    // FormDataから記事データを取得
    const postDataJson = formData.get('postData') as string;
    if (!postDataJson) {
      throw new Error('記事データが見つかりません');
    }
    
    const data = JSON.parse(postDataJson) as PostData;
    
    // FormDataから画像ファイルを取得
    const imageFile = formData.get('image') as File | null;
    
    // 画像ファイルがある場合はアップロード
    if (imageFile && imageFile.size > 0) {
      const timestamp = Date.now();
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}-${data.slug || 'post'}.${fileExt}`;
      
      const uploadResult = await uploadImage(imageFile, fileName);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      // アップロードした画像のURLを記事データに設定
      data.thumbnail_url = uploadResult.url;
    }
    
    // 直接Supabaseを使u7528して記事を保存
    let result;
    
    // スラッグの生成（タイトルから自動生成）
    if (!data.slug && data.title) {
      data.slug = createSlug(data.title);
    }
    
    // 本文から抜粋を生成
    if (!data.excerpt && data.content) {
      data.excerpt = generateExcerpt(data.content);
    }
    
    if (data.id) {
      // 既存の記事を更新
      const { data: post, error } = await supabase
        .from('posts')
        .update({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          thumbnail_url: data.thumbnail_url,
          status: data.status,
          updated_at: new Date().toISOString(),
          published_at: data.status === 'published' && !data.published_at ? new Date().toISOString() : data.published_at,
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message || '記事の更新中にエラーが発生しました');
      }
      
      result = post;
      
      // タグの更新
      if (data.tags && data.tags.length > 0) {
        // 現在のタグを削除
        await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', data.id);
        
        // 新しいタグを追加
        for (const tag of data.tags) {
          // タグが存在するか確認
          let { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tag)
            .single();
          
          let tagId;
          
          if (!existingTag) {
            // タグが存在しない場合は新規作成
            const { data: newTag } = await supabase
              .from('tags')
              .insert({ name: tag })
              .select('id')
              .single();
            
            tagId = newTag?.id;
          } else {
            tagId = existingTag.id;
          }
          
          // 記事とタグを関連付け
          await supabase
            .from('post_tags')
            .insert({ post_id: data.id, tag_id: tagId });
        }
      }
    } else {
      // 新規記事を作成
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          thumbnail_url: data.thumbnail_url,
          status: data.status,
          published_at: data.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message || '記事の作成中にエラーが発生しました');
      }
      
      result = post;
      
      // タグの追加
      if (data.tags && data.tags.length > 0 && result.id) {
        for (const tag of data.tags) {
          // タグが存在するか確認
          let { data: existingTag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tag)
            .single();
          
          let tagId;
          
          if (!existingTag) {
            // タグが存在しない場合は新規作成
            const { data: newTag } = await supabase
              .from('tags')
              .insert({ name: tag })
              .select('id')
              .single();
            
            tagId = newTag?.id;
          } else {
            tagId = existingTag.id;
          }
          
          // 記事とタグを関連付け
          await supabase
            .from('post_tags')
            .insert({ post_id: result.id, tag_id: tagId });
        }
      }
    }
    
    // キャッシュを再検証
    await revalidateBlogCache(data.slug);
    
    return { success: true, id: result.id, slug: data.slug };
  } catch (error: any) {
    console.error('記事保存エラー:', error);
    return { success: false, error: error.message || '記事の保存に失敗しました' };
  }
}
