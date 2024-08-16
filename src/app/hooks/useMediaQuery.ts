"use client";

import { useEffect, useState } from 'react';

export const mediaQuery = {
  sp: 'max-width: 767px',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  pc: 'min-width: 1024px',
};

// query: mediaQuery(画面サイズ定義)
export const useMediaQuery = (query: string) => {
  const formattedQuery = `(${query})`;
  const [match, setMatch] = useState(() => 
    window.matchMedia(formattedQuery).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(formattedQuery);
    if (mql.media === 'not all' || mql.media === 'invalid') {
      console.error(`useMediaQuery Error: Invalid media query`);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setMatch(e.matches);
    };

    // mediaQuery定義のサイズになったときに発火する。
    mql.addEventListener('change', handleChange);
    setMatch(mql.matches);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, [formattedQuery]);

  return match;
};
