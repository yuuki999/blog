"use client";

import React, { useEffect } from 'react';
import styles from '../styles/full_screen_menu.module.scss';
import { X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ZennIcon from './icon/ZennIcon';
import XIcon from './icon/XIcon';
import Image from 'next/image';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  
  // ページ全体のスクロールを防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

    if (href.startsWith('#')) {
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  };
  
  return (
    <div className={`${styles.fullScreenMenu} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="メニューを閉じる">
        <span className={styles.closeText}>Close</span>
        <X size={24} />
      </button>
      <nav className={styles.menuItems}>
        <ul>
          <li>
            <a href="/" onClick={(e) => handleLinkClick(e, '/')}>
              <span className={styles.menuText}>Home</span>
              <ArrowRight size={24} className={styles.menuIcon} />
            </a>
          </li>
          {pathname !== '/contact' && (
            <>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
                  <span className={styles.menuText}>About</span>
                  <ArrowRight size={24} className={styles.menuIcon} />
                </a>
              </li>
              <li>
                <a href="#service" onClick={(e) => handleLinkClick(e, '#service')}>
                  <span className={styles.menuText}>Services</span>
                  <ArrowRight size={24} className={styles.menuIcon} />
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleLinkClick(e, '/blog')}>
                  <span className={styles.menuText}>Blog</span>
                  <ArrowRight size={24} className={styles.menuIcon} />
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')}>
                  <span className={styles.menuText}>Contact</span>
                  <ArrowRight size={24} className={styles.menuIcon} />
                </a>
              </li>
            </>
          )}
          <div className={styles.socialIcons}>
            <a href="https://twitter.com/haru_tech9999" target="_blank" rel="noopener noreferrer">
              <XIcon className={styles.icon}/>
            </a>
            <a href="https://zenn.dev/yuuki999" target="_blank" rel="noopener noreferrer">
              <ZennIcon className={styles.icon}/>
            </a>
            <a href="https://qiita.com/yuki_itoi" target="_blank" rel="noopener noreferrer">
              <Image 
                src="/images/qiita-icon.png" 
                alt="Qiita" 
                width={24} 
                height={24} 
              />
            </a>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default FullScreenMenu;
