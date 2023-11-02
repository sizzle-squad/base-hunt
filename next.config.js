/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.midjourney.com',
      },
      {
        protocol: 'https',
        hostname: '**.seadn.io',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false };
    return config;
  },
};
