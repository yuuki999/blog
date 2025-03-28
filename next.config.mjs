/** @type {import('next').NextConfig} */
const nextConfig = {
  // ページ拡張子の設定
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 画像ドメインの設定
  images: {
    domains: ['storage.screenshotapi.net'],
    // SVG画像のサポートを有効化
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // または、より詳細な設定が必要な場合は remotePatterns を使用
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'storage.screenshotapi.net',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
  
  // React Markdownを使用するための設定
  // webpackの設定をカスタマイズして、シンタックスハイライターをサポート
  webpack: (config) => {
    // クライアントサイドでのみ必要なモジュールを処理
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
