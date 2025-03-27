import { getBlogPosts } from '@/utils/blog';
import BlogCard from '../components/BlogCard';
import Link from 'next/link';

export const metadata = {
  title: 'すべての記事 | HARU TECHNOLOGY',
  description: '技術記事やプログラミングに関するブログ記事一覧です。',
};

export default function BlogPage() {
  const allPosts = getBlogPosts();
  
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* メインコンテンツを横並びに配置 */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* 左側: 記事一覧 */}
          <div className="md:w-8/12 pr-0 md:pr-8">
            <h1 className="text-2xl font-bold text-white mb-8">すべての記事</h1>
            <div className="space-y-6">
              {allPosts.map((post) => (
                <div key={post.slug} className="bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
          
          {/* 右側: 最新の記事 */}
          <div className="w-full md:w-4/12 mt-0">
            <h2 className="text-2xl font-bold text-white mb-8">最新の記事</h2>
            <div className="space-y-4">
              {allPosts.slice(0, 2).map((post) => (
                <div key={post.slug} className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}