/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Keep compiled pages warm in memory
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60 * 2,
    pagesBufferLength: 60,
  },

  // Optimize large icon and utility libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  // Compress responses with gzip
  compress: true,
};

export default nextConfig;