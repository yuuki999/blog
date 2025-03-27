'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { format, formatDistance, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface BlogCardProps {
  post: BlogPost;
}

// 相対的な時間表示を行う関数
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // 経過時間をミリ秒単位で計算
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // 1時間以内
  if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  }
  // 24時間以内
  else if (diffHours < 24) {
    return `${diffHours}時間前`;
  }
  // 30日以内
  else if (diffDays < 30) {
    return `${diffDays}日前`;
  }
  // それ以上は日付表示
  else {
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  // 記事のサムネイル画像（ない場合はno-imageを使用）
  const thumbnailSrc = post.thumbnail || '/images/no-image.svg';
  
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={`/blog/${post.slug}`} className="block blog-card-link" style={{ color: '#ffffff', textDecoration: 'none' }}>
      {/* 横並びにするために、レイアウトを強化 - パディングも増加 */}
      <div className="flex flex-row items-center gap-4 py-4 px-3 rounded-lg" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          color: '#ffffff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* サムネイル画像 - 角丸の処理を修正し、右マージン追加 */}
        <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-lg" style={{ flexShrink: 0, marginRight: '1rem' }}>
          <Image 
            src={thumbnailSrc}
            alt={post.title}
            width={96}
            height={96}
            className="object-cover w-full h-full"
            style={{ borderRadius: '0.5rem' }}
          />
        </div>
        
        {/* 記事情報 - タイトルを小さく */}
        <div className="flex flex-col justify-center flex-grow min-w-0" style={{ flex: '1 1 auto' }}>
          <h2 className="text-sm font-medium mb-1 line-clamp-2" style={{ color: '#ffffff' }}>{post.title}</h2>
          
          {/* 経過時間のみ表示 - 文字色を白に変更 */}
          <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{getRelativeTime(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}