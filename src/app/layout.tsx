import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import ConditionalInitAnimation from "./components/animation/ConditionalInitAnimation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styles from './styles/base.module.scss';
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "HARU TECHNOLOGY",
  description: "エンジニアブログサイト",
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
            <Navigation />
            {children}
            <Footer />
          </main>
        </ConditionalInitAnimation>
      </body>
    </html>
  );
}
