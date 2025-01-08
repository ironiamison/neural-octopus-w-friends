/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: [
      'images.cryptocompare.com',
      'assets.coingecko.com',
      'messari.io',
      'static.messari.io',
      'i.imgur.com',
      'www.coingecko.com',
      'api.coingecko.com',
      'alternative.me',
      'cloudfront.net',
      's2.coinmarketcap.com',
      'assets.messari.io',
      'pbs.twimg.com',
      'avatars.githubusercontent.com'
    ]
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig 