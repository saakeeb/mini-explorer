import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
    reactRemoveProperties: isProd ? { properties: ["^data-testid$", "^data-test$"] } : false,
  },
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    optimizePackageImports: ["lucide-react", "zustand"],
    cssChunking: "graph",
    inlineCss: true,

    turbopackChunking: {
      minChunkSize: 20000,
      maxChunkCountPerGroup: 30,
      maxMergeChunkSize: 150000,
      generateComponentChunks: true,
      minComponentChunkSize: 15000,
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/(favicon.ico|robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
