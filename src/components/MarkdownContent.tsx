"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

interface MarkdownContentProps {
  content: string;
}

// Markdownコンテンツをレンダリングするクライアントコンポーネント
const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // コンテンツが空の場合は空の要素を返す
  if (!content) {
    return <div className="prose prose-lg max-w-none dark:prose-invert">コンテンツがありません</div>;
  }
  
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 見出しレベルのカスタマイズ - 間隔を広げる
          h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-12 pb-2 text-white" {...props} />,
          h2: (props) => <h2 className="text-2xl font-bold mt-16 mb-4 pb-1 text-white" {...props} />,
          h3: (props) => <h3 className="text-xl font-bold mt-5 mb-3 text-white" {...props} />,
          h4: (props) => <h4 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />,
          // 段落のカスタマイズ - 行間と上下マージンを調整
          p: (props) => <p className="my-4 text-gray-300 leading-relaxed" {...props} />,
          // リストのカスタマイズ - マージンを増やす
          ul: (props) => <ul className="list-disc pl-6 my-4 text-gray-300" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-4 text-gray-300" {...props} />,
          li: (props) => <li className="text-gray-300 mb-2" {...props} />,
          // リンクのカスタマイズ
          a: (props) => <a className="text-blue-400 hover:underline" {...props} />,
          // 強調のカスタマイズ
          strong: (props) => <strong className="text-white font-bold" {...props} />,
          em: (props) => <em className="text-gray-200 italic" {...props} />,
          // 画像のカスタマイズ - Next.jsのImageコンポーネントを使用
          img: ({ src, alt = '', ...props }) => {
            // 外部URLの場合は通常のイメージタグを使用
            if (!src || typeof src !== 'string') {
              return <img alt="" className="rounded-lg mx-auto my-8 max-w-full h-auto" {...props} />;
            }
            
            // 内部画像の場合は相対パスを使用
            if (src.startsWith('/')) {
              return (
                <div className="flex justify-center my-8">
                  <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={450}
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              );
            }
            
            // それ以外の場合は通常のイメージタグを使用
            return <img src={src} alt={alt} className="rounded-lg mx-auto my-8 max-w-full h-auto" {...props} />;
          },
          // 引用のカスタマイズ
          blockquote: (props) => <blockquote className="border-l-4 border-blue-500 bg-slate-800/50 p-4 rounded-r italic my-4" {...props} />,
          // コードブロックのシンタックスハイライト
          code: ({ className, children, ...props }) => {
            // 言語情報を取得
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // インラインコードかコードブロックかを判定
            const isInline = !match && (
              typeof children === 'string' && !children.includes('\n')
            );
            
            if (isInline) {
              // インラインコードの場合
              return (
                <code className="bg-slate-800 px-1 py-0.5 rounded text-sm text-blue-300" {...props}>
                  {children}
                </code>
              );
            }
            
            // コードブロックの場合はシンタックスハイライトを適用
            return (
              <div className="my-4 overflow-auto rounded-md">
                <SyntaxHighlighter
                  language={language || 'text'}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, borderRadius: '0.375rem', background: '#0f172a' }}
                  showLineNumbers={true}
                  wrapLines={true}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
