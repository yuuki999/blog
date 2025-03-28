import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '管理画面 | HARU TECHNOLOGY',
  description: 'ブログ記事管理画面',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 flex">
        {/* サイドバーナビゲーション */}
        <div className="w-64 bg-slate-800 min-h-screen p-4 sticky top-0 h-screen overflow-y-auto z-10">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white">ブログ管理</h1>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              ダッシュボード
            </Link>
            <Link href="/dashboard/posts" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              記事一覧
            </Link>
            <Link href="/dashboard/posts/new" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              新規記事作成
            </Link>
            <Link href="/dashboard/tags" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              タグ管理
            </Link>
            <Link href="/admin" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              画像アップロード
            </Link>
            <div className="border-t border-slate-700 my-4"></div>
            <Link href="/blog" className="block py-2 px-4 rounded hover:bg-slate-700 text-gray-300 hover:text-white">
              ブログに戻る
            </Link>
          </nav>
        </div>
        
        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
