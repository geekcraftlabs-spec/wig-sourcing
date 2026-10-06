import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  ...(isDev && {
    allowedDevOrigins: [
      "192.168.100.46",
      "localhost",
      "127.0.0.1",
      "192.168.*.*",
      "10.*.*.*",
    ],
  }),
};

export default nextConfig;