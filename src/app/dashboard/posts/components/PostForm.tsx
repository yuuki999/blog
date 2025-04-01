"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import TagSelector from './TagSelector';
import ImageUploader from './ImageUploader';
import MarkdownImageUploader from './MarkdownImageUploader';
import { revalidateBlogCache, savePostWithFormData } from '../actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Image as ImageIcon, FileImage } from 'lucide-react';

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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMarkdownImageUploader, setShowMarkdownImageUploader] = useState(false);
  const [markdownUploaderTransition, setMarkdownUploaderTransition] = useState(false);
  const [editorView, setEditorView] = useState<'edit' | 'split' | 'preview'>('split');
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [modalTransition, setModalTransition] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [highlightedContent, setHighlightedContent] = useState<string>('');
  const isFirstRender = useRef(true); // 初回レンダリングかどうかを追跡するためのref
    
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
  
  // エディタモーダルを開く処理
  const openEditorModal = () => {
    setShowEditorModal(true);
    // モーダルが表示された直後にアニメーション用のクラスを有効にする
    setTimeout(() => {
      setModalTransition(true);
    }, 10);
  };
  
  // エディタモーダルを閉じる処理
  const closeEditorModal = () => {
    setModalTransition(false);
    // アニメーション完了後にモーダルを非表示にする
    setTimeout(() => {
      setShowEditorModal(false);
    }, 300); // トランジションの時間と合わせる
  };
  
  // Markdown画像アップローダーモーダルを開く処理
  const openMarkdownImageUploader = () => {
    setShowMarkdownImageUploader(true);
    setTimeout(() => {
      setMarkdownUploaderTransition(true);
    }, 10);
  };
  
  // Markdown画像アップローダーモーダルを閉じる処理
  const closeMarkdownImageUploader = () => {
    setMarkdownUploaderTransition(false);
    setTimeout(() => {
      setShowMarkdownImageUploader(false);
    }, 300);
  };
  
  // 初期化時にデータが正しく設定されるようにする
  useEffect(() => {
    // 初回レンダリング時のみ値を設定し、それ以降は上書きしない
    if (isFirstRender.current && post?.content) {
      setValue('content', post.content);
      console.log('記事本文を初期設定しました:', post.content);
      isFirstRender.current = false;
    }
  }, [post, setValue]);
  
  const watchTags = watch('tags');
  const watchThumbnail = watch('thumbnail_url');
  const watchContent = watch('content');
  
  // フォーム送信処理
  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // FormDataを使用して画像ファイルと記事データを送信
      const formData = new FormData();
      
      // 記事データをJSON文字列としてFormDataに追加
      formData.append('postData', JSON.stringify(data));
      
      // 画像ファイルがあればFormDataに追加
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }
      
      // Server Actionを使用してFormDataを送信
      const result = await savePostWithFormData(formData);
      
      if (!result.success) {
        throw new Error(result.error || '記事の保存中にエラーが発生しました');
      }
      
      setSuccess('記事が保存されました');
      
      // クライアントサイドのキャッシュも更新
      router.refresh();
      
      // 画像選択状態をリセット
      setSelectedImageFile(null);
      setImagePreview(null);
      
      // 新規作成の場合は成功メッセージ表示後に一覧画面にリダイレクト
      if (!data.id && result.id) {
        // 成功メッセージを表示するために少し待つ
        setTimeout(() => {
          router.push('/dashboard/posts');
        }, 1500); // 1.5秒後に一覧画面にリダイレクト
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
  
  // 画像が選択されたときの処理
  const handleImageSelected = (file: File, previewUrl: string) => {
    setSelectedImageFile(file);
    setImagePreview(previewUrl);
    setValue('thumbnail_url', previewUrl); // プレビュー表示用
    setShowImageUploader(false);
  };
  
  // 画像選択をキャンセルしたときの処理
  const handleImageSelectCancel = () => {
    setShowImageUploader(false);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
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
            
            {(watchThumbnail || imagePreview) && (
              <div className="mt-4">
                <p className="text-white font-medium mb-2">プレビュー：</p>
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-slate-900">
                  <Image 
                    src={imagePreview || watchThumbnail || ''}
                    alt="サムネイルプレビュー"
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedImageFile && (
                  <p className="text-green-400 text-sm mt-2">画像が選択されました。記事保存時にアップロードされます。</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-2">
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              onCancel={handleImageSelectCancel} 
            />
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
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content" className="text-white font-medium">本文 (Markdown形式)</label>
          <button
            type="button"
            onClick={openEditorModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            全画面エディタを開く
          </button>
        </div>
        
        <div>
          <textarea
            id="content"
            {...register('content')}
            rows={8}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            onClick={openEditorModal}
            defaultValue={post?.content || ''}
          />
        </div>
        
        {/* モーダルエディタ */}
        {showEditorModal && (
          <>
            {/* 半透明の背景オーバーレイ */}
            <div 
              className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${
                modalTransition ? 'opacity-60' : 'opacity-10'
              }`} 
              onClick={closeEditorModal}
            />
            
            {/* エディタモーダル本体 */}
            <div 
              className={`fixed z-50 inset-0 flex items-center justify-center pointer-events-none`}
            >
              <div 
                className={`bg-slate-900 w-full h-full md:w-11/12 md:h-5/6 md:rounded-lg overflow-hidden flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out ${
                  modalTransition ? 'scale-100' : 'scale-95 opacity-0'
                }`}
              >
              <div className="flex justify-between items-center p-4 bg-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="flex bg-slate-700 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setEditorView('edit')}
                      className={`px-4 py-2 ${editorView === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600'}`}
                    >
                      エディタ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorView('split')}
                      className={`px-4 py-2 ${editorView === 'split' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600'}`}
                    >
                      分割表示
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorView('preview')}
                      className={`px-4 py-2 ${editorView === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-600'}`}
                    >
                      プレビュー
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={openMarkdownImageUploader}
                    className="p-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center transition-colors"
                    title="画像を挿入"
                  >
                    <ImageIcon size={20} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={closeEditorModal}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden p-4">
                <div className={`h-full ${editorView === 'split' ? 'md:grid md:grid-cols-2 md:gap-4' : 'block'}`}>
                  {/* エディタ */}
                  {(editorView === 'edit' || editorView === 'split') && (
                    <div className="h-full mb-4 md:mb-0">
                      <div className="relative h-full content-container">
                        <textarea
                          {...register('content')}
                          ref={contentTextareaRef}
                          className="w-full h-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
                          value={watch('content') || ''}
                          onChange={(e) => {
                            // テキストエリアの変更をフォームに反映
                            setValue('content', e.target.value, { shouldValidate: true });
                          }}
                          onKeyDown={(e) => {
                            // 画像タグの削除をサポート
                            const textarea = e.target as HTMLTextAreaElement;
                            const cursorPos = textarea.selectionStart;
                            const content = textarea.value;
                            
                            // 選択範囲がある場合は通常の削除動作を許可
                            if (textarea.selectionStart !== textarea.selectionEnd) {
                              return;
                            }
                            
                            // Backspaceキーが押された場合の処理
                            if (e.key === 'Backspace' && cursorPos > 0) {
                              // カーソル位置の前に画像タグがあるか確認
                              const beforeCursor = content.substring(0, cursorPos);
                              
                              // 完全な画像タグを検出する正規表現
                              // カーソルの直前が画像タグの終了位置か確認
                              const imageTagRegex = /!\[([^\]]*)\]\(([^\)]*)\)$/;
                              const match = beforeCursor.match(imageTagRegex);
                              
                              if (match) {
                                // 画像タグ全体を削除
                                e.preventDefault(); // デフォルトの削除動作を防止
                                const newContent = 
                                  content.substring(0, cursorPos - match[0].length) + 
                                  content.substring(cursorPos);
                                
                                // フォームの値を更新
                                setValue('content', newContent, { shouldValidate: true });
                                
                                // カーソル位置を更新
                                setTimeout(() => {
                                  textarea.focus();
                                  const newPosition = cursorPos - match[0].length;
                                  textarea.setSelectionRange(newPosition, newPosition);
                                }, 0);
                              }
                            }
                            
                            // Deleteキーが押された場合の処理
                            if (e.key === 'Delete' && cursorPos < content.length) {
                              // カーソル位置の後に画像タグがあるか確認
                              const afterCursor = content.substring(cursorPos);
                              
                              // 完全な画像タグを検出する正規表現
                              // カーソルの直後が画像タグの開始位置か確認
                              const imageTagRegex = /^!\[([^\]]*)\]\(([^\)]*)\)/;
                              const match = afterCursor.match(imageTagRegex);
                              
                              if (match) {
                                // 画像タグ全体を削除
                                e.preventDefault(); // デフォルトの削除動作を防止
                                const newContent = 
                                  content.substring(0, cursorPos) + 
                                  content.substring(cursorPos + match[0].length);
                                
                                // フォームの値を更新
                                setValue('content', newContent, { shouldValidate: true });
                                
                                // カーソル位置を維持
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(cursorPos, cursorPos);
                                }, 0);
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* プレビュー */}
                  {(editorView === 'preview' || editorView === 'split') && (
                    <div className="h-full bg-white dark:bg-slate-800 rounded-md overflow-auto border border-slate-300 dark:border-slate-600">
                      <div className="p-4 prose prose-slate prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200">
                        {watchContent ? (
                          <div className="break-words">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({node, ...props}) => <p className="my-4" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-5 mb-2" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-base font-bold mt-4 mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-4" {...props} />,
                                li: ({node, ...props}) => <li className="my-2" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic" {...props} />,
                                pre: ({node, ...props}) => <pre className="bg-slate-900 p-4 rounded-md my-4 overflow-x-auto" {...props} />,
                                hr: () => <hr className="my-6 border-t border-slate-300 dark:border-slate-600" />,
                                code: ({inline, className, children, ...props}: any) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline ? (
                                    <pre className="bg-slate-900 p-4 rounded-md my-4 overflow-x-auto">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code className="bg-slate-800 px-1 py-0.5 rounded text-sm" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {watchContent}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">プレビューはここに表示されます。Markdownを入力してください。</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={closeEditorModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  編集完了
                </button>
              </div>
              
              {/* Markdown画像アップローダー */}
              {showMarkdownImageUploader && (
                <>
                  {/* 半透明の背景オーバーレイ */}
                  <div 
                    className={`fixed inset-0 z-[60] bg-black transition-opacity duration-300 ease-in-out ${
                      markdownUploaderTransition ? 'opacity-60' : 'opacity-10'
                    }`} 
                    onClick={closeMarkdownImageUploader}
                  />
                  
                  {/* アップローダーモーダル本体 */}
                  <div
                    className={`fixed z-[60] inset-0 flex items-center justify-center pointer-events-none`}
                  >
                    <div
                      className={`bg-slate-900 rounded-lg overflow-hidden pointer-events-auto transition-transform duration-300 ease-in-out ${
                        markdownUploaderTransition ? 'scale-100' : 'scale-95 opacity-0'
                      }`}
                    >
                    <MarkdownImageUploader 
                      onImageInsert={(markdownImageTag) => {
                        // テキストエリアのカーソル位置に画像タグを挿入
                        const textarea = contentTextareaRef.current;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const content = textarea.value;
                          const newContent = content.substring(0, start) + markdownImageTag + content.substring(end);
                          
                          // フォームの値を更新
                          setValue('content', newContent, { shouldValidate: true });
                          
                          // カーソル位置を更新
                          setTimeout(() => {
                            textarea.focus();
                            const newPosition = start + markdownImageTag.length;
                            textarea.setSelectionRange(newPosition, newPosition);
                          }, 0);
                        }
                      }}
                      onClose={closeMarkdownImageUploader}
                    />
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>
          </>
        )}
        
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
      <div className="flex flex-col space-y-4">
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
        
        {/* メッセージ表示部分 */}
        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 text-green-200 p-4 rounded-md animate-pulse">
            {success}
          </div>
        )}
      </div>
    </form>
  );
}
