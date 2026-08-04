import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
