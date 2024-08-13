"use client";

import { useState } from 'react';
import styles from '../styles/base.module.scss';
import XIcon from './icon/XIcon';
import ZennIcon from './icon/ZennIcon';
import Navigation from './Navigation';

interface HeaderProps {
  onMenuToggle: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>HARU TECHNOLOGY</h1>
      <button className={styles.menuButton} onClick={onMenuToggle}>
        <span className={styles.menuIcon}></span>
      </button>
      <div className={styles.subtitle}>
        <a href="https://twitter.com/haru_tech9999" target="_blank" rel="noopener noreferrer">
          <XIcon className={styles.icon} />
        </a>
        <a href="https://zenn.dev/yuuki999" target="_blank" rel="noopener noreferrer">
          <ZennIcon className={styles.icon} />
        </a>
      </div>
    </header>
  );
}

export default Header;
