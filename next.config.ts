import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api-gateway', 'flights-service', 'booking-service'],
  },
};

export default nextConfig;
