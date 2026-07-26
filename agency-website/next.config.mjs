/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Type-checking still gates the build; lint is run explicitly via `npm run lint`.
    ignoreDuringBuilds: true,
  },
  // three.js and its ecosystem ship ESM that benefits from Next's transpile pipeline.
  transpilePackages: ['three'],
  compiler: {
    // Strip console.* in production bundles (keeps warnings/errors for observability).
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    // Tree-shake large icon / animation libraries down to what is actually imported.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
