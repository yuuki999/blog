"use client";

import React from 'react';
import styles from '../styles/profile.module.scss';
import Image from 'next/image';
import { mediaQuery, useMediaQuery } from '../hooks/useMediaQuery';

function Profile() {
    const isMobile = useMediaQuery(mediaQuery.sp);

    return (
        <section id="about" className={`${styles.profile} ${isMobile ? styles.mobile : ''}`}>
            <div className={styles.profile_image}>
              <Image
                src="/images/dog.jpeg"
                alt="yuuki san"
                layout="intrinsic"
                width={300}
                height={500}
              />
            </div>
            <div className={styles.profile_details}>
                <h2>Yuki Itoi</h2>
                <p>茨城県古河市出身、埼玉県大宮市在住。<br/>
                趣味は筋トレと犬、猫の動画を見ることです。<br/>
                受託開発会社にて勤務、その後業界最大手ピラティス企業にてエンジニアとして勤務しています。<br/>
                TypeScriptやReact、Next.jsを使用した開発が得意ですが、ご要望に沿った最適なソリューションの提案が可能です。<br/>
                生成AI関連に関する開発もご相談ください。
                </p>
            </div>
        </section>
    );
}

export default Profile;
