/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mo-marketplace-api-production.up.railway.app',
      },
    ],
  },
}

module.exports = nextConfig
