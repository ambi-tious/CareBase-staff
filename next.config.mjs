const nextConfig = {
  output: 'standalone',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    return config;
  },
};
export default nextConfig;
