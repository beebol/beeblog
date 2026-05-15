/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // 禁用预渲染缓存，避免需要写入 .next 目录
  experimental: {
    isrMemoryCacheSize: 0,
  },
};

module.exports = nextConfig;
