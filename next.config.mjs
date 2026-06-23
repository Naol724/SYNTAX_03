/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fix webpack chunk loading issues
  webpack: (config, { isServer }) => {
    // Improve chunk splitting stability
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }
    return config;
  },
  // Improve build stability
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
