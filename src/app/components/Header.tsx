import styles from '../styles/base.module.scss';

interface IconProps {
  className?: string;
}

const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="black"/>
  </svg>
);

const ZennIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 88.3 88.3"
    xmlSpace="preserve"
    className={className}
  >
    <g fill="#3EA8FF">
      <path
        className="st0"
        d="M3.9,83.3h17c0.9,0,1.7-0.5,2.2-1.2L69.9,5.2c0.6-1-0.1-2.2-1.3-2.2H52.5c-0.8,0-1.5,0.4-1.9,1.1L3.1,81.9
        C2.8,82.5,3.2,83.3,3.9,83.3z"
      />
      <path
        className="st0"
        d="M62.5,82.1l22.1-35.5c0.7-1.1-0.1-2.5-1.4-2.5h-16c-0.6,0-1.2,0.3-1.5,0.8L43,81.2c-0.6,0.9,0.1,2.1,1.2,2.1
        h16.3C61.3,83.3,62.1,82.9,62.5,82.1z"
      />
    </g>
  </svg>
);

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>HARU TECHNOLOGY</h1>
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
