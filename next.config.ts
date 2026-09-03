import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets a phone (or a browser automation tab) on the LAN load
  // the dev server's JS and HMR. Ignored by production builds.
  allowedDevOrigins: ["192.168.1.66", "*.local"],
  experimental: {
    serverActions: {
      // The visualizer quote action carries the current design as a JPEG
      // (client-downscaled, typically <1MB). Default is 1MB; 8mb leaves
      // room for the image plus multipart overhead.
      bodySizeLimit: "8mb",
    },
  },
  images: {
    // Optimized variants are cached for 31 days instead of the 4-hour
    // default — the site's photos only ever change by being renamed, and
    // short TTLs meant every few hours someone paid the cold re-encode.
    minimumCacheTTL: 2678400,
    // TEMPORARY: design scenes and pattern swatches are Unsplash placeholders
    // until the real product photography lands. Drop this block once the
    // shots live in /public/images/designs.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Photos and video are treated as immutable: replacements get new
        // filenames, so browsers and the CDN never need to revalidate.
        source: "/:prefix(images|videos)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
