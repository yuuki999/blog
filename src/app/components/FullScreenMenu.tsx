import React from 'react';
import styles from '../styles/full_screen_menu.module.scss';
import { X, ArrowRight } from 'lucide-react';

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
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
      <button className={styles.closeButton} onClick={onClose}>
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
            <a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')}>
              <span className={styles.menuText}>Contact</span>
              <ArrowRight size={24} className={styles.menuIcon} />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default FullScreenMenu;
