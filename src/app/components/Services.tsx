import React from 'react';
import styles from '../styles/service.module.scss';
import Image from 'next/image';
import Link from 'next/link';

type ServiceItem = {
    title: string;
    icon: string;
    description: string;
    category: string;
    value: string;
}

const serviceItems: ServiceItem[] = [
  {
    title: "AI駆動開発トレーニング",
    icon: "/images/ai-training.svg",
    description: "最新のAI技術を活用した開発手法を学び、開発効率を飛躍的に向上させるためのトレーニングプログラムを提供します。個人のスキルアップから企業全体のDX推進まで対応します。",
    category: "教育",
    value: "ai_training"
  },
  {
    title: "AI活用コンサルティング",
    icon: "/images/ai-consulting.svg",
    description: "あなたのビジネスや業務プロセスにAIをどのように導入すべきか、具体的な活用方法と導入戦略をご提案します。レガシーな業務からの脱却を支援します。",
    category: "コンサルティング",
    value: "ai_consulting"
  },
  {
    title: "受託開発サービス",
    icon: "/images/development.svg",
    description: "AI技術を活用した効率的な開発手法で、Webアプリケーション、業務システム、モバイルアプリなどの開発を承ります。最新技術と豊富な経験で、高品質な成果物を提供します。",
    category: "開発",
    value: "custom_development"
  },
  {
    title: "レガシーシステム刷新",
    icon: "/images/legacy-renewal.svg",
    description: "古いシステムや非効率な業務プロセスを最新技術で刷新し、業務効率と競争力を向上させます。段階的な移行計画から実装まで、リスクを最小限に抑えた移行を実現します。",
    category: "開発",
    value: "legacy_renewal"
  },
  {
    title: "新規サービス開発",
    icon: "/images/new-service.svg",
    description: "アイデアの段階から市場投入まで、新規サービスの開発をトータルサポート。AI技術を活用したプロトタイピングで、短期間での検証と改善を繰り返し、成功確率を高めます。",
    category: "開発",
    value: "new_service"
  },
  {
    title: "最新技術POC",
    icon: "/images/poc.svg",
    description: "最新のAI技術や開発手法の概念実証（POC）を実施。ビジネスへの導入前に技術の有効性を検証し、リスクを最小化しながら革新的な技術導入を支援します。",
    category: "研究開発",
    value: "tech_poc"
  }
];

function ServiceItem({ item }: { item: ServiceItem }) {
  return (
    <Link href={`/contact?serviceType=${item.value}`} className={styles.serviceLink}>
      <div className={styles.serviceItem}>
        {/* アイコン画像が用意できたら有効化 */}
        {/* <Image src={item.icon} width={60} height={60} alt={item.title} /> */}
        <div className={styles.serviceCategory}>{item.category}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </Link>
  );
}

function Services() {
  return (
    <section id="service" className={styles.services}>
      <h2>Services</h2>
      <p className={styles.serviceIntro}>
        AI駆動開発の教育から、実際の開発支援、受託開発まで幅広いサービスを提供します。<br/>
        レガシーシステムの刷新、新規サービス開発、最新技術のPOCなど、お客様のニーズに合わせた最適なソリューションをご提案します。<br/>
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
