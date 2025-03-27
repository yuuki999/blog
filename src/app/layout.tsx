import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import "./styles/links.css"; // リンクスタイルを追加
import ConditionalInitAnimation from "./components/animation/ConditionalInitAnimation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from './styles/base.module.scss';
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "大宮システム開発・Web制作 | HARU TECHNOLOGY",
  description: "埼玉県大宮市を拠点とするシステム開発・Web制作サービス。無料相談から本格的なカスタム開発まで、あらゆるIT課題に対応します。埼玉県内のビジネスに最適なWeb・システムソリューションをご提供。",
  keywords: "大宮, システム開発, Web制作, IT相談, 埼玉, カスタム開発, ホームページ制作",
  openGraph: {
    title: "大宮システム開発・Web制作 | HARU TECHNOLOGY",
    description: "埼玉県大宮市を拠点とするシステム開発・Web制作サービス。無料相談から本格的なカスタム開発まで、あらゆるIT課題に対応します。",
    url: "https://www.yuki-engineer.com/",
    siteName: "HARU TECHNOLOGY",
    locale: "ja_JP",
    type: "website",
  },
};

// RSC
// レンダリングの順番は、
//  children<page.tsx>(RSC) -> Header(RSC) -> RootLayout(RSC) -> InitAnimation(CC)
//  子のRSCから処理され、CCが処理される。console.logの順番で確認した結果。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ConditionalInitAnimation>
          <main className={styles.main}>
            <Header />
            {children}
            <Footer />
            <ScrollToTopButton />
          </main>
        </ConditionalInitAnimation>
        <Analytics />
      </body>
    </html>
  );
}
