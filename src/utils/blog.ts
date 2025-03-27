import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostDetail } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

// MDXファイルからメタデータを取得する関数
export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags || [],
      };
    });
  
  // 日付の新しい順にソート
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 特定のスラッグの記事を取得
export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      frontmatter: {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags || [],
      },
      content,
    };
  } catch (error) {
    return null;
  }
}

// 全ての記事のスラッグを取得する関数
export function getAllPostSlugs() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map((filename) => ({
      slug: filename.replace(/\.mdx$/, ''),
    }));
}

// 日付をフォーマットする関数
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'yyyy年MM月dd日', { locale: ja });
}

// 相対的な時間表示を行う関数
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // 経過時間をミリ秒単位で計算
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // 1時間以内
  if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  }
  // 24時間以内
  else if (diffHours < 24) {
    return `${diffHours}時間前`;
  }
  // 30日以内
  else if (diffDays < 30) {
    return `${diffDays}日前`;
  }
  // それ以上は日付表示
  else {
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  }
}
