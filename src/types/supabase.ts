// Supabaseのテーブル型定義

// 記事テーブル
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  author_id: string | null;
  status: 'draft' | 'published';
}

// タグテーブル
export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

// 記事とタグの関連テーブル
export interface PostTag {
  post_id: string;
  tag_id: string;
}

// ユーザーテーブル
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}