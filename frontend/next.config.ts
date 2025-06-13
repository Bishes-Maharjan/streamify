import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Add this for better error reporting
  productionBrowserSourceMaps: true,
  // Disable static optimization temporarily to debug

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
};

export default nextConfig;
