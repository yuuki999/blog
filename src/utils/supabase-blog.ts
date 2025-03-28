import { supabase } from './supabase';
import { BlogPost, BlogPostDetail } from '@/types/blog';
import { Post, Tag } from '@/types/supabase';

// Supabaseから公開済みの記事一覧を取得する関数
export async function getSupabasePosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(tag:tags(*))
      `)
      .eq('status', 'published') // 公開済みの記事のみを取得
      .order('published_at', { ascending: false });

    if (error) {
      console.error('記事取得エラー:', error);
      return [];
    }

    // Supabaseのデータ形式からBlogPost形式に変換
    return data.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      date: post.published_at || post.created_at,
      excerpt: post.excerpt || '',
      tags: post.tags?.map((tagRel: any) => tagRel.tag.name) || [],
      thumbnail: post.thumbnail_url,
    }));
  } catch (error) {
    console.error('記事取得エラー:', error);
    return [];
  }
}

// Supabaseから特定のスラッグの記事を取得
export async function getSupabasePostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(tag:tags(*))
      `)
      .eq('slug', slug)
      .eq('status', 'published') // 公開済みの記事のみを取得
      .single();

    if (error || !data) {
      console.error('記事取得エラー:', error);
      return null;
    }

    // タグを抽出
    const tags = data.tags?.map((tagRel: any) => tagRel.tag.name) || [];

    return {
      slug: data.slug,
      frontmatter: {
        title: data.title,
        date: data.published_at || data.created_at,
        excerpt: data.excerpt || '',
        tags: tags,
        thumbnail: data.thumbnail_url,
      },
      content: data.content,
    };
  } catch (error) {
    console.error('記事取得エラー:', error);
    return null;
  }
}

// Supabaseからすべての記事のスラッグを取得
export async function getSupabaseAllPostSlugs() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      console.error('スラッグ取得エラー:', error);
      return [];
    }

    return data.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('スラッグ取得エラー:', error);
    return [];
  }
}

// Supabaseからすべてのタグを取得
export async function getSupabaseTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('name')
      .order('name');

    if (error) {
      console.error('タグ取得エラー:', error);
      return [];
    }

    return data.map((tag) => tag.name);
  } catch (error) {
    console.error('タグ取得エラー:', error);
    return [];
  }
}

// 特定のタグを持つ記事を取得
export async function getSupabasePostsByTag(tagName: string): Promise<BlogPost[]> {
  try {
    // まずタグIDを取得
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();

    if (tagError || !tagData) {
      console.error('タグ取得エラー:', tagError);
      return [];
    }

    // そのタグを持つ記事IDを取得
    const { data: postTagData, error: postTagError } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', tagData.id);

    if (postTagError || !postTagData || postTagData.length === 0) {
      console.error('記事タグ取得エラー:', postTagError);
      return [];
    }

    // 記事IDのリストを作成
    const postIds = postTagData.map(pt => pt.post_id);

    // 記事を取得（公開済みのみ）
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        tags:post_tags(tag:tags(*))
      `)
      .in('id', postIds)
      .eq('status', 'published') // 公開済みの記事のみを取得
      .order('published_at', { ascending: false });

    if (postsError || !postsData) {
      console.error('記事取得エラー:', postsError);
      return [];
    }

    // Supabaseのデータ形式からBlogPost形式に変換
    return postsData.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      date: post.published_at || post.created_at,
      excerpt: post.excerpt || '',
      tags: post.tags?.map((tagRel: any) => tagRel.tag.name) || [],
      thumbnail: post.thumbnail_url,
    }));
  } catch (error) {
    console.error('タグ付き記事取得エラー:', error);
    return [];
  }
}
