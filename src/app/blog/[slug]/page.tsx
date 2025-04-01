import Link from 'next/link';
import Image from 'next/image';
import { getSupabasePostBySlug, getSupabaseAllPostSlugs } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/blog';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// クライアントコンポーネントを動的インポート
const MarkdownContent = dynamic(() => import('@/components/MarkdownContent'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-slate-800 h-96 rounded-lg"></div>
});

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getSupabasePostBySlug(params.slug);
  
  if (!post) {
    return {
      title: '記事が見つかりませんでした',
      description: 'お探しの記事は見つかりませんでした。',
    };
  }
  
  return {
    title: `${post.frontmatter.title} | HARU TECHNOLOGY`,
    description: post.frontmatter.excerpt,
    keywords: post.frontmatter.tags.join(', '),
  };
}

// 静的生成のためのパスを生成
export async function generateStaticParams() {
  return await getSupabaseAllPostSlugs();
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getSupabasePostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
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
        
        {/* 記事ヘッダー - タイトルを先に表示するデザイン */}
        <div className="rounded-lg p-8 mb-8 bg-slate-900/50">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.frontmatter.title}</h1>
          <p className="text-gray-400 text-sm mb-4">{formatDate(post.frontmatter.date)}</p>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.tags.map((tag: string) => (
                <Link
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  key={tag} 
                  className="px-3 py-1.5 text-sm rounded-full transition-colors duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-blue-900) 30%, transparent)',
                    color: 'var(--color-blue-300)'
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {post.frontmatter.thumbnail && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={post.frontmatter.thumbnail}
                alt={post.frontmatter.title}
                fill
                className="object-cover"
                priority
                quality={95}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
        </div>
        
        {/* 記事本文 */}
        <article className="rounded-lg p-8 shadow-lg bg-slate-900/50">
          {/* React Markdownを使用してマークダウンをレンダリング */}
          <MarkdownContent content={post.content} />
        </article>
      </div>
    </div>
  );
}
