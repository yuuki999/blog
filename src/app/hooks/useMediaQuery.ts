"use client";

import { useEffect, useState } from 'react';

export const mediaQuery = {
  sp: 'max-width: 767px',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  pc: 'min-width: 1024px',
};

export const useMediaQuery = (query: string) => {
  const formattedQuery = `(${query})`;
  const [match, setMatch] = useState(false);  // 初期値を false に設定

  useEffect(() => {
    // クライアントサイドでのみ実行
    const updateMatch = () => {
      const mql = window.matchMedia(formattedQuery);
      if (mql.media === 'not all' || mql.media === 'invalid') {
        console.error(`useMediaQuery Error: Invalid media query`);
      }
      setMatch(mql.matches);
    };

    // 初期状態を設定
    updateMatch();

    const mql = window.matchMedia(formattedQuery);
    const handleChange = (e: MediaQueryListEvent) => {
      setMatch(e.matches);
    };

    // mediaQuery定義のサイズになったときに発火する。
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, [formattedQuery]);

  return match;
};
