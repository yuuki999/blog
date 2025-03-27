'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={`/blog?page=${currentPage - 1}`} className="px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
          前のページ
        </Link>
      )}
      
      <span className="px-4 py-2 bg-slate-600 rounded-md">
        {currentPage} / {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <Link href={`/blog?page=${currentPage + 1}`} className="px-4 py-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
          次のページ
        </Link>
      )}
    </div>
  );
}
