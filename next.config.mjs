/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['sanity'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**'
      }
    ]
  }
}

export default nextConfig
