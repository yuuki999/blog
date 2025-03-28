"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 一時的に静的画像を使用するデモ用の関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      // 一時的に静的画像を使用（Vercel Blob Storageの設定が完了するまで）
      const timestamp = Date.now();
      const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
      
      // デモ用に静的画像を使用
      const demoImageUrl = `/images/profile.jpeg?t=${timestamp}`;
      setUploadedUrl(demoImageUrl);
      
      // 以下は本番環境用のコード（現在はコメントアウト）
      /*
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/blob-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アップロードに失敗しました');
      }

      const blob = await response.json();
      setUploadedUrl(blob.url);
      */
    } catch (error) {
      console.error('エラー:', error);
      setError(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">画像アップロード</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-slate-700 file:text-white
              hover:file:bg-slate-600"
          />
        </div>
        <button
          type="submit"
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md">
          {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="mb-2 text-white">アップロード成功！以下のURLをコピーしてください：</p>
          <div className="flex">
            <input
              type="text"
              value={uploadedUrl}
              readOnly
              className="flex-1 p-2 bg-slate-700 text-white rounded-l-md"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(uploadedUrl);
                alert('URLをコピーしました！');
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-r-md hover:bg-slate-500"
            >
              コピー
            </button>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-white">プレビュー：</p>
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-900">
              <Image 
                src={uploadedUrl}
                alt="アップロードされた画像"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
