/** @type {import('next').NextConfig} */
const nextConfig = {
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