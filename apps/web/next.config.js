process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui-avatars.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  transpilePackages: [
    '@career-bridge/store',
    '@career-bridge/types',
    '@career-bridge/services',
    '@career-bridge/utils',
    '@career-bridge/ai',
    '@career-bridge/config',
    '@career-bridge/ui',
    '@career-bridge/realtime',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  reactStrictMode: false,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/quiz',
        destination: '/onboarding',
        permanent: true,
      },
      {
        source: '/quiz/:path*',
        destination: '/onboarding',
        permanent: true,
      },
    ];
  },
  // Serve static assets with long-lived cache headers only in production
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/_next/static/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          ],
        },
      ];
    }
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      '@career-bridge/store',
      '@career-bridge/types',
    ],
  },
};

module.exports = nextConfig;

