import Link from 'next/link';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 記事管理カード */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">記事管理</h2>
          <p className="text-gray-300 mb-6">ブログ記事の作成、編集、削除を行います。</p>
          <div className="flex space-x-4">
            <Link 
              href="/dashboard/posts" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              記事一覧
            </Link>
            <Link 
              href="/dashboard/posts/new" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              新規作成
            </Link>
          </div>
        </div>
        
        {/* タグ管理カード */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">タグ管理</h2>
          <p className="text-gray-300 mb-6">ブログ記事のカテゴリー分けに使用するタグを管理します。</p>
          <Link 
            href="/dashboard/tags" 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            タグ管理
          </Link>
        </div>
        
        {/* メディア管理カード */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">メディア管理</h2>
          <p className="text-gray-300 mb-6">ブログ記事で使用する画像やファイルをアップロードします。</p>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            画像アップロード
          </Link>
        </div>
        
        {/* ブログプレビューカード */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">ブログプレビュー</h2>
          <p className="text-gray-300 mb-6">公開されているブログ記事を確認します。</p>
          <Link 
            href="/blog" 
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            ブログを表示
          </Link>
        </div>
      </div>
    </div>
  );
}