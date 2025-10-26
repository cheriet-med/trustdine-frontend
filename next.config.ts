import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,

  output: 'standalone',
  // Webpack configuration for optimization and debugging
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix webpack caching issues
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        allowCollectingMemory: true,
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    // Bundle analyzer - helps visualize what's in your bundles
    // Install: npm install --save-dev @next/bundle-analyzer
    // Enable with: ANALYZE=true npm run build
    if (process.env.ANALYZE && !isServer) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
          // Generate report file if you want to save it
          generateStatsFile: true,
          statsFilename: 'bundle-stats.json',
        })
      );
    }

    // Optimize GSAP imports - prevents importing entire GSAP library
    config.resolve.alias = {
      ...config.resolve.alias,
      'gsap/all': 'gsap/index.js',
    };

    // Split chunks for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          gsap: {
            name: 'gsap',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](gsap)[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
          },
          icons: {
            name: 'icons',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // Add chunk for next-intl if it's large
          intl: {
            name: 'intl',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](next-intl)[\\/]/,
            priority: 15,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Always return the modified config
    return config;
  },

  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dhnn7xish/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
  },

  // Add these new video optimizations
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
    {
  source: '/_next/image',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
  ]
},
    // Video files in public directory
    {
      source: '/:path*.mp4',
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
  source: '/:path*',
  headers: [
    { key: 'X-Robots-Tag', value: 'index, follow' }
  ]
}

  ],

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'gsap', 'next-intl'],
    // Disable caching issues in production builds
    webpackBuildWorker: true,
  },

  // Compress static assets
  compress: true,

  // SWC minification is enabled by default in Next.js 15
  // swcMinify: true, // Removed - not needed in Next.js 15
  
  transpilePackages: ['leaflet'],
};

// Alternative approach using @next/bundle-analyzer (cleaner)
let config = nextConfig;

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
    openAnalyzer: true,
  });
  config = withBundleAnalyzer(nextConfig);
}

export default withNextIntl(config);