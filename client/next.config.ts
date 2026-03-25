import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => {
    // Use environment variable for backend URL
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8000";

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
