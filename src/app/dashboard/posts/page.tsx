import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { formatDate } from '@/utils/blog';
import { revalidatePath } from 'next/cache';

// 記事削除のServer Action
async function deletePost(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  
  if (!id) return { error: '記事IDが指定されていません' };
  
  try {
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
      return { error: error.message };
    }
    
    // キャッシュを再検証
    revalidatePath('/dashboard/posts');
    revalidatePath('/blog');
    
    return { success: true };
  } catch (error) {
    console.error('記事削除エラー:', error);
    return { error: '記事の削除中にエラーが発生しました' };
  }
}

export default async function PostsPage() {
  // 記事一覧を取得
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      tags:post_tags(tag:tags(*))
    `)
    .order('updated_at', { ascending: false });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">記事一覧</h1>
        <Link 
          href="/dashboard/posts/new" 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          新規作成
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-md mb-6">
          エラーが発生しました: {error.message}
        </div>
      )}
      
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-slate-700">
            <tr>
              <th className="py-3 px-4 text-white">タイトル</th>
              <th className="py-3 px-4 text-white">ステータス</th>
              <th className="py-3 px-4 text-white">更新日</th>
              <th className="py-3 px-4 text-white">タグ</th>
              <th className="py-3 px-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-white">
                    <Link href={`/dashboard/posts/${post.id}`} className="hover:text-blue-400">
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-900/50 text-green-300' : 'bg-amber-900/50 text-amber-300'}`}>
                      {post.status === 'published' ? '公開中' : '下書き'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {post.updated_at ? formatDate(post.updated_at) : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags && post.tags.length > 0 ? (
                        post.tags.map((tagRel: any) => (
                          <span key={tagRel.tag.id} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                            {tagRel.tag.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/dashboard/posts/${post.id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        編集
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button 
                          type="submit"
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          onClick={(e) => {
                            if (!confirm('この記事を削除してもよろしいですか？')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          削除
                        </button>
                      </form>
                      {post.status === 'published' && (
                        <Link 
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700"
                        >
                          表示
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                  記事がありません。新しい記事を作成してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
