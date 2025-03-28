"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // タグ一覧を取得
  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tags');
      
      if (!response.ok) {
        throw new Error('タグの取得に失敗しました');
      }
      
      const data = await response.json();
      setTags(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初回読み込み時にタグを取得
  useEffect(() => {
    fetchTags();
  }, []);
  
  // 新しいタグを作成
  const createTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      setError('タグ名を入力してください');
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          setError('同名のタグが既に存在します');
        } else {
          throw new Error(data.error || 'タグの作成に失敗しました');
        }
        return;
      }
      
      setSuccess('タグが作成されました');
      setNewTagName('');
      fetchTags(); // タグ一覧を更新
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  // タグを削除
  const deleteTag = async (id: string) => {
    if (!confirm('このタグを削除してもよろしいですか？関連付けられた記事からもタグが削除されます。')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'タグの削除に失敗しました');
      }
      
      setSuccess('タグが削除されました');
      fetchTags(); // タグ一覧を更新
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">タグ管理</h1>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-md mb-6">
          {success}
        </div>
      )}
      
      {/* 新規タグ作成フォーム */}
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">新規タグ作成</h2>
        <form onSubmit={createTag} className="flex space-x-4">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="新しいタグ名を入力"
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            作成
          </button>
        </form>
      </div>
      
      {/* タグ一覧 */}
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
        <h2 className="text-xl font-bold text-white p-6 border-b border-slate-700">タグ一覧</h2>
        
        {isLoading ? (
          <div className="p-6 text-center text-gray-400">読み込み中...</div>
        ) : tags.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="py-3 px-6 text-white">タグ名</th>
                <th className="py-3 px-6 text-white">作成日</th>
                <th className="py-3 px-6 text-white">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-700/50">
                  <td className="py-3 px-6 text-white">{tag.name}</td>
                  <td className="py-3 px-6 text-gray-300">
                    {new Date(tag.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/blog/tag/${tag.name}`}
                        target="_blank"
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        表示
                      </Link>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-400">
            タグがありません。新しいタグを作成してください。
          </div>
        )}
      </div>
    </div>
  );
}
