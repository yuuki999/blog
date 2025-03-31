"use client";

import styles from '../styles/base.module.scss';
import XIcon from './icon/XIcon';
import ZennIcon from './icon/ZennIcon';
import { mediaQuery, useMediaQuery } from '../hooks/useMediaQuery';
import Navigation from './Navigation';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
  const isMobile = useMediaQuery(mediaQuery.sp);

  return (
    <header className={styles.header}>
        {isMobile ? (
          <>
            <div className={styles.oneRow}>
              <h1 className={styles.title}> <Link href="/" className={styles.homeLink}>HARU TECHNOLOGY<span className={styles.subtitle_region}>大宮・埼玉のシステム開発</span></Link></h1>
              <Navigation />
            </div>
          </>
        ) : (
          <>
            <div className={styles.topRow}>
              <h1 className={styles.title}> <Link href="/" className={styles.homeLink}>HARU TECHNOLOGY<span className={styles.subtitle_region}>大宮・埼玉のシステム開発</span></Link></h1>
              <div className={styles.subtitle}>
                <a href="https://twitter.com/haru_tech9999" target="_blank" rel="noopener noreferrer">
                  <XIcon className={styles.icon} />
                </a>
                <a href="https://zenn.dev/yuuki999" target="_blank" rel="noopener noreferrer">
                  <ZennIcon className={styles.icon} />
                </a>
                <a href="https://qiita.com/yuki_itoi" target="_blank" rel="noopener noreferrer">
                  <Image 
                    src="/images/qiita-icon.png" 
                    alt="Qiita" 
                    width={24} 
                    height={24} 
                    className={styles.icon}
                  />
                </a>
                <a href="https://note.com/yuki_itoi" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/images/note-icon.png"
                    alt="Note"
                    width={24}
                    height={24}
                    className={styles.icon}
                  />
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
