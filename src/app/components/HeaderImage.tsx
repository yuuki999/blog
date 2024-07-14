import styles from '../styles/base.module.scss';
import Image from 'next/image';

function HeaderImage() {
  
    return (
        <section className={styles.header_image}>
          <div className={styles.svg_container}>


            <svg xmlns="http://www.w3.org/2000/svg" height="88px" viewBox="0 -960 960 960" width="88px" fill="currentColor">
              <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z"/>
            </svg>
          </div>
        </section>
    );
}

export default HeaderImage;
