import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ds9qj3exf/**',
      },
    ],
     
  },

  // Add these new video optimizations:
  headers: async () => [
    {
      // Video caching rules
      source: '/videos/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
        { 
          key: 'Content-Type',
          value: 'video/mp4' 
        }
      ],
    },
    // Keep your existing robots header
    {
      source: '/:locale',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'index, follow',
        },
      ],
    },
  ],
transpilePackages: ['leaflet'],
  // Enable AVIF/WebP for videos in Image component
  experimental: {
    optimizePackageImports: ['next-video'],
    // Enable if using Next.js 14+
    webVitalsAttribution: ['CLS', 'LCP']
  }
};

export default withNextIntl(nextConfig);