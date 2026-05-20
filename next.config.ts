import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["10.194.15.139"],
  transpilePackages: ["lucide-react"],
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
