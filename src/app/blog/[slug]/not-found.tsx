import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">記事が見つかりません</h1>
      <p className="text-xl mb-8">お探しの記事は存在しないか、移動された可能性があります。</p>
      <Link href="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        ブログ一覧に戻る
      </Link>
    </div>
  );
}
