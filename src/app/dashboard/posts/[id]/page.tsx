import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import PostForm from '../components/PostForm';

export const metadata = {
  title: '記事編集 | HARU TECHNOLOGY',
  description: 'ブログ記事を編集します。',
};

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // 記事データを取得
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      tags:post_tags(tag:tags(*))
    `)
    .eq('id', id)
    .single();
  
  if (error || !post) {
    notFound();
  }
  
  // タグデータを整形
  const tags = post.tags?.map((tagRel: any) => tagRel.tag.name) || [];
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">記事編集</h1>
      <PostForm post={{ ...post, tags }} />
    </div>
  );
}
