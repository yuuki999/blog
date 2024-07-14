'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InitAnimation from './InitAnimation';

const ANIMATION_COOLDOWN = 10 * 60 * 1000; // 10分（ミリ秒）

export default function ConditionalInitAnimation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const [showAnimation, setShowAnimation] = useState<boolean | null>(null);

  useEffect(() => {
    if (isInitialMount.current) { // 初回レンダリング時のみ実行、開発者モードだとStrict Modeで2回レンダリングされる。
      isInitialMount.current = false;
  
      const checkShowAnimation = () => {
        const now = new Date().getTime();
        const lastVisit = localStorage.getItem('lastVisit');
        const isNewSession = !sessionStorage.getItem('sessionStarted');
  
        if (!lastVisit || (now - parseInt(lastVisit, 10)) > ANIMATION_COOLDOWN) {
          if (isNewSession && pathname === '/') {
            localStorage.setItem('lastVisit', now.toString());
            return true;
          }
        }
        return false;
      };
  
      setShowAnimation(checkShowAnimation());
      sessionStorage.setItem('sessionStarted', 'true');
    }

  }, [pathname]);

  if (showAnimation) {
    return <InitAnimation>{children}</InitAnimation>;
  }

  return <>{children}</>;
}
