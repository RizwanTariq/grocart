import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // typedRoutes: true,
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    typedEnv: true,
  },
};

export default nextConfig;
