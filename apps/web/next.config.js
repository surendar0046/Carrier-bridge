/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@career-bridge/ui', 
    '@career-bridge/store', 
    '@career-bridge/services', 
    '@career-bridge/types',
    '@career-bridge/utils',
    '@career-bridge/config',
    '@career-bridge/ai',
    '@career-bridge/realtime'
  ],
  images: { domains: ['ui-avatars.com'] },
};

module.exports = nextConfig;
