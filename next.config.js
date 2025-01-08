/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig 