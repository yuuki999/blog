import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllPostSlugs, formatDate } from '@/utils/blog';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// MDXオプションはシンプルにします

// メタデータを動的に生成
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
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
  return getAllPostSlugs();
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/blog" className="text-teal-400 hover:text-teal-300 mb-4 inline-flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ブログ一覧に戻る
        </Link>
        
        <article className="prose prose-lg prose-invert max-w-none">
          {/* 記事ヘッダー */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-3">{post.frontmatter.title}</h1>
            
            <div className="flex items-center mb-4">
              {/* 著者情報 */}
              <div className="flex items-center mr-4">
                <Image 
                  src={post.frontmatter.thumbnail || '/images/no-image.svg'}
                  alt={post.frontmatter.title}
                  width={32}
                  height={32}
                  className="rounded-full mr-2 object-cover"
                />
                <div>
                  <p className="text-white text-sm font-medium">{post.frontmatter.author || '管理者'}</p>
                  <p className="text-gray-400 text-xs">{formatDate(post.frontmatter.date)}</p>
                </div>
              </div>
              
              {/* タグ */}
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 記事本文 */}
          <div className="prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-teal-400 prose-code:text-teal-300 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
