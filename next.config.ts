import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'api-gateway',
      },
      {
        protocol: 'http',
        hostname: 'flights-service',
      },
      {
        protocol: 'http',
        hostname: 'booking-service',
      },
    ],
  },
};

export default nextConfig;
