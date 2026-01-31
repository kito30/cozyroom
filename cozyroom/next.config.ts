import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.com" // 👈 Changed "" to a real URL
        ).hostname,
        pathname: process.env.NEXT_PUBLIC_SUPABASE_IMAGE_PATH || "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;