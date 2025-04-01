"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void;
  onCancel: () => void;
}

export default function ImageUploader({ onImageSelected, onCancel }: ImageUploaderProps) {
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
        const previewUrl = e.target.result as string;
        setPreview(previewUrl);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleConfirmSelection = () => {
    if (!file || !preview) return;
    
    // 親コンポーネントに選択した画像ファイルとプレビューURLを渡す
    onImageSelected(file, preview);
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
            画像を選択
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
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
          
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleConfirmSelection}
              disabled={!file}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              選択を確定
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
