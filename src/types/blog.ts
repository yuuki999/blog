// ブログ記事のメタデータの型定義
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string; // サムネイル画像のURL
  author?: string; // 著者名
};

// ブログ記事の詳細情報の型定義
export type BlogPostDetail = {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    author?: string; // 著者名
    thumbnail?: string; // サムネイル画像のURL
  };
  content: string;
};
