import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import React from 'react'

// MDXコンポーネントをカスタマイズするための設定ファイル
// ここでは、見出し、リスト、コードブロックなどのスタイルを定義できます
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 見出しのスタイル
    h1: (props) => (
      <h1 className="text-3xl font-bold mb-6 mt-8" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-2xl font-bold mb-4 mt-6" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-xl font-bold mb-3 mt-5" {...props} />
    ),
    // 段落のスタイル
    p: (props) => (
      <p className="mb-4 leading-relaxed" {...props} />
    ),
    // リストのスタイル
    ul: (props) => (
      <ul className="list-disc pl-6 mb-4" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal pl-6 mb-4" {...props} />
    ),
    // コードブロックのスタイル
    code: (props) => (
      <code className="bg-slate-800 p-1 rounded text-sm" {...props} />
    ),
    // 画像の最適化
    // MDXの画像には通常のイメージタグを使用し、Next.jsのImageコンポーネントは使用しない
    img: (props) => {
      const { src, alt = '', ...rest } = props;
      if (!src) {
        return <img alt="" {...rest} />;
      }
      
      return (
        <img
          src={src}
          alt={alt}
          className="rounded-lg max-w-full h-auto my-4"
          {...rest}
        />
      );
    },
    // その他のコンポーネントはそのまま使用
    ...components,
  }
}
