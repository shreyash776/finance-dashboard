import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },

  // Rewrites for API proxying (if needed)
  async rewrites() {
    return [
      // Add any API rewrites here if needed
    ];
  },

  // Image optimization
  images: {
    domains: [
      // Add any external image domains here
      'api.coinbase.com',
      'assets.coingecko.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Experimental features
  experimental: {
    // Enable modern features
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
};

export default nextConfig;
