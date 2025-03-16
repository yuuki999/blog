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
    title: "大宮・埼玉 無料IT相談",
    // icon: "/images/consultation.svg",
    description: "大宮市を中心とした埼玉県内のお客様のニーズや予算、目標をヒアリングし、最適なWebサイト・システム構築プランをご提案します。地域ビジネスに特化したIT相談を承ります。",
    price: "無料",
    value: "free_consultation"
  },
  {
    title: "大宮向けテンプレートプラン",
    // icon: "/images/template.svg",
    description: "埼玉県大宮市の地域ビジネスに最適化された既存のテンプレートをベースに、迅速かつコスト効率の良いWebサイトを構築します。地域SEO対策込み。",
    price: "プラン A",
    value: "template_plan"
  },
  {
    title: "埼玉ビジネス向けフルカスタマイズ",
    // icon: "/images/custom.svg",
    description: "大宮・埼玉のビジネスニーズに合わせて、完全にフルスクラッチでWebサイト・システムを構築いたします。地域特性を活かした柔軟なデザイン、機能を追加することが可能です。",
    price: "プラン B",
    value: "full_customization"
  },
  {
    title: "大宮エリア 改修・リプレイス",
    // icon: "/images/upgrade.svg",
    description: "埼玉県大宮市周辺のビジネス向けに、既存のWebサイトの改善、最新技術へのアップグレード、全面的なリニューアル・データベースのパフォーマンス改善等に対応します。",
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
      </p>
      
      {/* <div className={styles.servicesGrid}>
        {serviceItems.map((item, index) => (
          <ServiceItem key={index} item={item} />
        ))}
      </div> */}
    </section>
  );
}

export default Services;
