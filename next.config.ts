import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'api-gateway' },
      { protocol: 'http', hostname: 'flights-service' },
      { protocol: 'http', hostname: 'booking-service' },
    ],
  },
  async rewrites() {
    // Server-side env vars (not NEXT_PUBLIC_) — resolved at request time by the Node server
    const gatewayUrl = process.env.GATEWAY_SERVICE_URL || 'http://localhost:8000';
    const flightsUrl = process.env.FLIGHTS_SERVICE_URL || 'http://localhost:3000';
    const bookingUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:3001';
    const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4000';

    return [
      { source: '/proxy/gateway/:path*', destination: `${gatewayUrl}/:path*` },
      { source: '/proxy/flights/:path*', destination: `${flightsUrl}/:path*` },
      { source: '/proxy/booking/:path*', destination: `${bookingUrl}/:path*` },
      { source: '/proxy/notification/:path*', destination: `${notificationUrl}/:path*` },
    ];
  },
};

export default nextConfig;
