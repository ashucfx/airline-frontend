import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000',
    NEXT_PUBLIC_FLIGHTS_SERVICE_URL: process.env.NEXT_PUBLIC_FLIGHTS_SERVICE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BOOKING_SERVICE_URL: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || 'http://localhost:3001',
  },
};

export default nextConfig;
