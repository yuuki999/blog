"use client";

import styles from '../styles/base.module.scss';
import XIcon from './icon/XIcon';
import ZennIcon from './icon/ZennIcon';
import { mediaQuery, useMediaQuery } from '../hooks/useMediaQuery';
import Navigation from './Navigation';

function Header() {
  const isMobile = useMediaQuery(mediaQuery.sp);

  return (
    <header className={styles.header}>
        {isMobile ? (
          <>
            <div className={styles.oneRow}>
              <h1 className={styles.title}>HARU TECHNOLOGY</h1>
              <Navigation />
            </div>
          </>
        ) : (
          <>
            <div className={styles.topRow}>
              <h1 className={styles.title}>HARU TECHNOLOGY</h1>
              <div className={styles.subtitle}>
                <a href="https://twitter.com/haru_tech9999" target="_blank" rel="noopener noreferrer">
                  <XIcon className={styles.icon} />
                </a>
                <a href="https://zenn.dev/yuuki999" target="_blank" rel="noopener noreferrer">
                  <ZennIcon className={styles.icon} />
                </a>
              </div>
            </div>
            <div className={styles.bottomRow}>
              <Navigation />
            </div>
          </>
        )}
    </header>
  );
}

export default Header;
