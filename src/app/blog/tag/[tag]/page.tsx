import Link from 'next/link';
import { getSupabasePostsByTag, getSupabaseTags } from '@/utils/supabase-blog';
import { Metadata } from 'next';
import BlogCard from '@/app/components/BlogCard';
import TagList from '@/app/components/TagList';

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `${tag}に関する記事 | HARU TECHNOLOGY`,
    description: `${tag}に関するブログ記事の一覧です。`,
  };
}

// 静的生成のためのパスを生成
export async function generateStaticParams() {
  const tags = await getSupabaseTags();
  
  return tags.map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  
  // 指定されたタグを持つ記事を取得
  const filteredPosts = await getSupabasePostsByTag(tag);
  
  // すべてのタグを取得
  const allTags = await getSupabaseTags();
  
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="group inline-flex items-center px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-all duration-200 text-gray-300 hover:text-white border border-slate-700 hover:border-blue-500 shadow-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            <span className="font-medium">ブログ一覧に戻る</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-6">
          <span className="text-blue-400">{tag}</span> に関する記事
        </h1>
        
        {filteredPosts.length > 0 ? (
          <div className="space-y-6 mb-12">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300">
                <BlogCard key={post.slug} post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-8 mb-12 text-center">
            <p className="text-gray-300">このタグの記事はまだありません。</p>
          </div>
        )}
        
        {/* タグ一覧 */}
        <TagList tags={allTags} className="bg-slate-900/50 rounded-lg p-6" />
      </div>
    </div>
  );
}
