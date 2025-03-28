"use client";

import { useState, useEffect } from 'react';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<{id: string, name: string}[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 利用可能なタグを取得
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tags');
        
        if (!response.ok) {
          throw new Error('タグの取得に失敗しました');
        }
        
        const data = await response.json();
        setAvailableTags(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  // タグを追加
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      onTagsChange([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // タグを削除
  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };
  
  // 既存のタグを選択
  const selectExistingTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
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
            <option key={tag.id} value={tag.name} />
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
      
      {/* 選択中のタグ */}
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedTags.map((tag) => (
          <div key={tag} className="flex items-center px-3 py-1.5 text-sm rounded-full" style={{
              backgroundColor: 'color-mix(in oklab, var(--color-blue-900) 30%, transparent)',
              color: 'var(--color-blue-300)'
            }}>
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-blue-100"
              style={{ color: 'var(--color-blue-300)' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* 利用可能なタグ一覧 */}
      {!isLoading && availableTags.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">利用可能なタグ：</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter(tag => !selectedTags.includes(tag.name))
              .map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => selectExistingTag(tag.name)}
                  className="px-3 py-1.5 text-sm rounded-full transition-colors duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-blue-900) 30%, transparent)',
                    color: 'var(--color-blue-300)'
                  }}
                >
                  {tag.name}
                </button>
              ))
            }
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
