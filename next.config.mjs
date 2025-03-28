/** @type {import('next').NextConfig} */
const nextConfig = {
  // ページ拡張子の設定
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 画像ドメインの設定
  images: {
    domains: [
      'storage.screenshotapi.net',
      'mizs5weedkzw53f0.public.blob.vercel-storage.com', // Vercel Blob Storageのホスト名
    ],
    // SVG画像のサポートを有効化
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // より安全な設定としてremotePatternsを使用することも可能
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'storage.screenshotapi.net',
    //     port: '',
    //     pathname: '/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: '*.public.blob.vercel-storage.com',
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
