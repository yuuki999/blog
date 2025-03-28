"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';

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
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
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
  
  // 利用可能なタグを取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data.map((tag: any) => tag.name));
        }
      } catch (error) {
        console.error('タグ取得エラー:', error);
      }
    };
    
    fetchTags();
  }, []);
  
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
  
  // タグを追加
  const addTag = () => {
    if (tagInput.trim() && !watchTags?.includes(tagInput.trim())) {
      setValue('tags', [...(watchTags || []), tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // タグを削除
  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      (watchTags || []).filter(tag => tag !== tagToRemove)
    );
  };
  
  // 画像アップロードページを開く
  const openImageUploader = () => {
    window.open('/admin', '_blank');
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
        <label htmlFor="thumbnail_url" className="block text-white font-medium mb-2">サムネイル画像URL</label>
        <div className="flex space-x-2">
          <input
            id="thumbnail_url"
            type="text"
            {...register('thumbnail_url')}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={openImageUploader}
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
      </div>
      
      {/* タグ */}
      <div>
        <label htmlFor="tags" className="block text-white font-medium mb-2">タグ</label>
        <div className="flex space-x-2">
          <input
            id="tag-input"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タグを入力して Enter または 追加ボタンをクリック"
            list="available-tags"
          />
          <datalist id="available-tags">
            {availableTags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            追加
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {watchTags?.map((tag) => (
            <div key={tag} className="flex items-center bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-300 hover:text-blue-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
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
