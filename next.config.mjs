/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Keep compiled pages warm in memory so switching pages doesn't trigger recompilation delays
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60 * 2, // 2 hours
    pagesBufferLength: 60,
  },
  // Tree-shake large icon and utility libraries — only bundle what's used
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  // Compress responses with gzip
  compress: true,
};

export default nextConfig;
