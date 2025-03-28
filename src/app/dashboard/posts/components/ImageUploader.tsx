"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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

      const response = await fetch('/api/blob-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アップロードに失敗しました');
      }

      const blob = await response.json();
      
      // 親コンポーネントに通知
      onImageUploaded(blob.url);
    } catch (error: any) {
      setError(error.message || '画像のアップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            onClick={handleUpload}
            disabled={uploading || !file}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 w-full"
          >
            {uploading ? 'アップロード中...' : 'アップロードする'}
          </button>
        </div>
      )}
    </div>
  );
}
