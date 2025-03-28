import { getSupabasePosts, getSupabaseTags } from '@/utils/supabase-blog';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';
import Pagination from '../components/Pagination';
import TagList from '../components/TagList';

export const metadata = {
  title: 'すべての記事 | HARU TECHNOLOGY',
  description: '技術記事やプログラミングに関するブログ記事一覧です。',
  metadataBase: new URL('https://harutech.co.jp'),
};

// メインページコンポーネント
export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const allPosts = await getSupabasePosts();
  
  // ページネーションの設定
  const postsPerPage = 10;
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  
  // 現在のページの記事を取得
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allPosts.slice(startIndex, endIndex);
  
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* メインコンテンツを横並びに配置 */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* 左側: 記事一覧 */}
          <div className="md:w-8/12 pr-0 md:pr-8">
            <h1 className="text-2xl font-bold text-white mb-8">すべての記事</h1>
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <div key={post.slug} className="bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            
            {/* ページネーション */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
          
          {/* 右側: 最新の記事とタグ一覧 - モバイルでは非表示 */}
          <div className="hidden md:block md:w-4/12 mt-0">
            <h2 className="text-2xl font-bold text-white mb-8">最新の記事</h2>
            <div className="space-y-4 mb-8">
              {allPosts.slice(0, 2).map((post) => (
                <div key={`latest-${post.slug}`} className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
            
            {/* タグ一覧 */}
            <TagList 
              tags={await getSupabaseTags()} 
              className="bg-slate-800 rounded-lg p-6 mt-8" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}