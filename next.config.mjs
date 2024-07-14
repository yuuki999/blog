/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['storage.screenshotapi.net'],
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
