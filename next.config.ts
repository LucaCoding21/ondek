import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
