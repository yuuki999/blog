"use server";

import { revalidatePath } from 'next/cache';

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
