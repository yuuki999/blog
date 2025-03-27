/** @type {import('next').NextConfig} */

const nextConfig = {
  // MDXファイルをサポートするための設定
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
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
};

export default nextConfig;
