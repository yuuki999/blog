'use client';

import { useCallback } from 'react';
import styles from '../styles/base.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'service', label: 'Service', isInternal: true },
  { id: 'about', label: 'Profile', isInternal: true },
  { id: 'works', label: 'Works', isInternal: true },
  { id: 'contact', label: 'Contact', isInternal: false, href: '/contact' }
];

function Navigation() {
  const pathname = usePathname();
  
  const scrollToSection = useCallback((sectionId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Contact ページ以外で表示するリンクをフィルタリング
  const visibleItems = pathname === '/contact'
    ? navItems.filter(item => !item.isInternal || item.id === 'contact')
    : navItems;

  return (
    <nav className={styles.hero}>
      <div className={styles.navigation}>
        <Link href="/" className={styles.navItem}>HOME</Link>
        {visibleItems.map(item => (
          item.isInternal ? (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={scrollToSection(item.id)}
              className={styles.navItem}
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.id}
              href={item.href || '/'}
              className={styles.navItem}
            >
              {item.label}
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
