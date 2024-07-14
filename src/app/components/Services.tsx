import React from 'react';
import styles from '../styles/service.module.scss';
import Image from 'next/image';
import Link from 'next/link';

type ServiceItem = {
    title: string;
    // icon: string;
    description: string;
    price: string;
    value: string;
}

const serviceItems: ServiceItem[] = [
  {
    title: "無料相談",
    // icon: "/images/consultation.svg",
    description: "お客様のニーズや予算、目標をヒアリングし、最適なwebサイト・システム構築プランをご提案します。その他のご相談も承ります。",
    price: "無料",
    value: "free_consultation"
  },
  {
    title: "テンプレートプラン",
    // icon: "/images/template.svg",
    description: "既存のテンプレートをベースに、迅速かつコスト効率の良いwebサイトを構築します。",
    price: "プラン A",
    value: "template_plan"
  },
  {
    title: "フルカスタマイズ",
    // icon: "/images/custom.svg",
    description: "完全にフルスクラッチでwebサイト・システムを構築いたします。柔軟なデザイン、機能を追加することが可能です。",
    price: "プラン B",
    value: "full_customization"
  },
  {
    title: "改修・リプレイス",
    // icon: "/images/upgrade.svg",
    description: "既存のwebサイトの改善、最新技術へのアップグレード、全面的なリニューアル・データベースのパフォーマンス改善等に対応します。",
    price: "プラン C",
    value: "upgrade_replace"
  }
];

function ServiceItem({ item }: { item: ServiceItem }) {
  return (
    <Link href={`/contact?serviceType=${item.value}`} className={styles.serviceLink}>
      <div className={`${styles.serviceItem} ${item.price === "無料" ? styles.freeConsultation : ''}`}>
        {/* <Image src={item.icon} width={60} height={60} alt={item.title} /> */}
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className={styles.servicePrice}>{item.price}</div>
      </div>
    </Link>
  );
}

function Services() {
  return (
    <section id="service" className={styles.services}>
      <h2>Services</h2>
      <p className={styles.serviceIntro}>
        予算、納期、カスタマイズ性に応じて、最適なwebサイト構築プランをご提案します。<br/>
        システムに関するご依頼が初めての方は、お気軽に無料相談からお問い合わせください。<br/>
        またその他プランでも、ご相談に関しては無料で実施いたしますのでご安心ください。
      </p>
      
      <div className={styles.servicesGrid}>
        {serviceItems.map((item, index) => (
          <ServiceItem key={index} item={item} />
        ))}
      </div>
      
      <p className={styles.serviceOutro}>
        各プランは柔軟にカスタマイズ可能です。ニーズに合わせて最適なソリューションを提供いたします。
      </p>
    </section>
  );
}

export default Services;
