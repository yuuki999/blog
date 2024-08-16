'use client';

import { useCallback, useState, useEffect } from 'react';
import styles from '../styles/base.module.scss';
import navStyles from '../styles/navigation.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery, mediaQuery } from '../hooks/useMediaQuery';
import { Menu } from 'lucide-react';

const navItems = [
  { id: 'service', label: 'Service', isInternal: true },
  { id: 'about', label: 'Profile', isInternal: true },
  { id: 'works', label: 'Works', isInternal: true },
  { id: 'contact', label: 'Contact', isInternal: false, href: '/contact' }
];

function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery(mediaQuery.sp);
  const isTablet = useMediaQuery(mediaQuery.tablet);
  
  const scrollToSection = useCallback((sectionId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  }, []);

  const visibleItems = pathname === '/contact'
    ? navItems.filter(item => !item.isInternal || item.id === 'contact')
    : navItems;

  useEffect(() => {
    // スマホ表示でなくなったらハンバーガーメニューを閉じる。
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // ハンバーガーメニューを開く
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.hero}>
      <div className={styles.navigation}>
        {isMobile ? (
          <>
            <button onClick={toggleMenu} className={navStyles.menuButton}>
              <span className={navStyles.menuText}>Menu</span>
              <Menu size={24} />
            </button>
            {isMenuOpen && (
              <div className={styles.mobileMenu}>
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
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="/">HOME</Link>
              {visibleItems.map(item => (
                item.isInternal ? (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={scrollToSection(item.id)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href || '/'}
                  >
                    {item.label}
                  </Link>
                )
              ))}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
