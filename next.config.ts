import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async redirects() {
    return [
      ...['google-merchant','meta-commerce','chatgpt','licensing','troubleshooting'].map(slug => ({ source: `/docs/${slug}.html`, destination: `/docs/${slug}`, permanent: true })),
      { source: '/docs/index.html', destination: '/docs', permanent: true },
      { source: '/download/index.html', destination: '/download', permanent: true },
    ];
  },
};

export default nextConfig;

