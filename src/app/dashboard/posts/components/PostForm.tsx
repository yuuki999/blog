"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import TagSelector from './TagSelector';
import ImageUploader from './ImageUploader';

// フォームのバリデーションスキーマ
const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'タイトルは必須です'),
  content: z.string().min(1, '本文は必須です'),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published']),
  thumbnail_url: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: PostFormData & { published_at?: string; updated_at?: string };
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  
  // React Hook Formの設定
  const { 
    register, 
    handleSubmit, 
    control,
    setValue,
    watch,
    formState: { errors } 
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: post?.id || undefined,
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      slug: post?.slug || '',
      status: post?.status || 'draft',
      thumbnail_url: post?.thumbnail_url || null,
      tags: post?.tags || [],
    },
  });
  
  const watchTags = watch('tags');
  const watchThumbnail = watch('thumbnail_url');
  

  
  // フォーム送信処理
  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const url = data.id 
        ? `/api/posts/${data.id}` 
        : '/api/posts';
      
      const method = data.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '記事の保存中にエラーが発生しました');
      }
      
      setSuccess('記事が保存されました');
      
      // 新規作成の場合は編集ページにリダイレクト
      if (!data.id && result.id) {
        router.push(`/dashboard/posts/${result.id}`);
      } else {
        // キャッシュを更新
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // タグが変更されたときの処理
  const handleTagsChange = (newTags: string[]) => {
    setValue('tags', newTags);
  };
  
  // 画像アップローダーの表示切り替え
  const toggleImageUploader = () => {
    setShowImageUploader(!showImageUploader);
  };
  
  // 画像がアップロードされたときの処理
  const handleImageUploaded = (url: string) => {
    setValue('thumbnail_url', url);
    setShowImageUploader(false);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-md">
          {success}
        </div>
      )}
      
      {/* タイトル */}
      <div>
        <label htmlFor="title" className="block text-white font-medium mb-2">タイトル</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      
      {/* スラッグ */}
      <div>
        <label htmlFor="slug" className="block text-white font-medium mb-2">
          スラッグ (URLの一部になります。空白の場合はタイトルから自動生成)
        </label>
        <input
          id="slug"
          type="text"
          {...register('slug')}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* 抜粋 */}
      <div>
        <label htmlFor="excerpt" className="block text-white font-medium mb-2">
          抜粋 (空白の場合は本文から自動生成)
        </label>
        <textarea
          id="excerpt"
          {...register('excerpt')}
          rows={2}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* サムネイル */}
      <div>
        <label htmlFor="thumbnail_url" className="block text-white font-medium mb-2">サムネイル画像</label>
        
        {!showImageUploader ? (
          <>
            <div className="flex space-x-2">
              <input
                id="thumbnail_url"
                type="text"
                {...register('thumbnail_url')}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="画像URLまたはアップロードしてください"
              />
              <button
                type="button"
                onClick={toggleImageUploader}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                画像アップロード
              </button>
            </div>
            
            {watchThumbnail && (
              <div className="mt-4">
                <p className="text-white font-medium mb-2">プレビュー：</p>
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-900">
                  <Image 
                    src={watchThumbnail}
                    alt="サムネイルプレビュー"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-2">
            <ImageUploader onImageUploaded={handleImageUploaded} />
            <button
              type="button"
              onClick={toggleImageUploader}
              className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
            >
              キャンセル
            </button>
          </div>
        )}
      </div>
      
      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-white font-medium mb-2">タグ</label>
        <TagSelector 
          selectedTags={watchTags || []} 
          onTagsChange={handleTagsChange} 
        />
      </div>
      
      {/* 本文 */}
      <div>
        <label htmlFor="content" className="block text-white font-medium mb-2">本文 (Markdown形式)</label>
        <textarea
          id="content"
          {...register('content')}
          rows={15}
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
        {errors.content && (
          <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>
      
      {/* ステータス */}
      <div>
        <label className="block text-white font-medium mb-2">ステータス</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status')}
              value="draft"
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-white">下書き</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status')}
              value="published"
              className="form-radio h-5 w-5 text-green-600"
            />
            <span className="ml-2 text-white">公開</span>
          </label>
        </div>
      </div>
      
      {/* 送信ボタン */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
        <Link
          href="/dashboard/posts"
          className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}
