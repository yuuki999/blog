"use client";

import { useState } from 'react';
import Link from 'next/link';

type TabType = 'for-you' | 'following' | 'trending';

interface BlogTabsProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export default function BlogTabs({ activeTab = 'for-you', onTabChange }: BlogTabsProps) {
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab);
  
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  return (
    <div className="flex border-b border-gray-700 mb-6">
      <TabButton 
        isActive={currentTab === 'for-you'} 
        onClick={() => handleTabChange('for-you')}
      >
        For You
      </TabButton>
      <TabButton 
        isActive={currentTab === 'following'} 
        onClick={() => handleTabChange('following')}
      >
        Following
      </TabButton>
      <TabButton 
        isActive={currentTab === 'trending'} 
        onClick={() => handleTabChange('trending')}
      >
        Trending
      </TabButton>
    </div>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ children, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm relative ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400"></span>
      )}
    </button>
  );
}
