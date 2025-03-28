"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TagListProps {
  tags: string[];
  className?: string;
}

export default function TagList({ tags, className = '' }: TagListProps) {
  const router = useRouter();
  
  // タグの重複を削除し、アルファベット順にソート
  const uniqueTags = Array.from(new Set(tags)).sort();
  
  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-bold mb-4 text-white">タグ一覧</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((tag) => (
          <Link 
            href={`/blog/tag/${encodeURIComponent(tag)}`} 
            key={tag}
            className="px-3 py-1.5 text-sm rounded-full transition-colors duration-200 hover:opacity-80"
            style={{
              backgroundColor: 'color-mix(in oklab, var(--color-blue-900) 30%, transparent)',
              color: 'var(--color-blue-300)'
            }}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
