/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ✅ Disable overlay
  onDemandEntries: {
    // Prevent page from reloading for every keystroke in dev
    maxInactiveAge: 1000 * 60 * 60,
  },
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  // ✅ Hide error overlay
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;
