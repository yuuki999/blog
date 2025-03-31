"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface MarkdownImageUploaderProps {
  onImageInsert: (markdownImageTag: string) => void;
  onClose: () => void;
}

export default function MarkdownImageUploader({ onImageInsert, onClose }: MarkdownImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);

    // ファイルをプレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      // Vercel Blobにアップロード
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'posts'); // postsディレクトリを指定

      const response = await fetch('/api/blob-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アップロードに失敗しました');
      }

      const blob = await response.json();
      
      // Markdown形式の画像タグを生成して親コンポーネントに通知
      const imageAlt = altText || '画像';
      const markdownImageTag = `![${imageAlt}](${blob.url})`;
      onImageInsert(markdownImageTag);
      onClose();
    } catch (error: any) {
      setError(error.message || '画像のアップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg space-y-4 w-full max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Markdown画像の挿入</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="flex-1">
          <div className="px-4 py-2 bg-slate-700 text-white rounded-md cursor-pointer hover:bg-slate-600 text-center">
            {uploading ? '画像をアップロード中...' : '画像を選択'}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <label htmlFor="alt-text" className="block text-white font-medium mb-2">代替テキスト (alt)</label>
        <input
          id="alt-text"
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="画像の説明を入力（SEOに重要）"
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-white font-medium mb-2">プレビュー：</p>
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-900">
            <Image 
              src={preview}
              alt="プレビュー"
              fill
              className="object-cover"
            />
          </div>
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? 'アップロード中...' : (
              <>
                <Upload size={16} className="mr-2" />
                アップロードして挿入
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
