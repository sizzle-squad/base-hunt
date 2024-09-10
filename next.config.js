/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'go.wallet.coinbase.com',
      },

      {
        protocol: 'https',
        hostname: 'basehunt.xyz',
      },
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.wallet.coinbase.com/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false };

    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      issuer: /\.\w+(?<!(s?c|sa)ss)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext][query]',
      },
    });

    return config;
  },
};
