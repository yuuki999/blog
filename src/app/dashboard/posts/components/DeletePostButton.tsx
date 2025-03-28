"use client";

import { useTransition } from 'react';

interface DeletePostButtonProps {
  postId: string;
  deletePost: (formData: FormData) => Promise<any>;
}

export default function DeletePostButton({ postId, deletePost }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={deletePost}>
      <input type="hidden" name="id" value={postId} />
      <button 
        type="submit"
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
        disabled={isPending}
        onClick={(e) => {
          if (!confirm('この記事を削除してもよろしいですか？')) {
            e.preventDefault();
          }
        }}
      >
        {isPending ? '削除中...' : '削除'}
      </button>
    </form>
  );
}
