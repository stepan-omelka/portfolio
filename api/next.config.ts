import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The repo root has its own package-lock.json; pin Turbopack to this app.
  turbopack: { root: path.join(__dirname) },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // In production the Angular build is copied into public/ (`npm run build:site`).
      // Every path that isn't an API route or a file is an Angular route, so it gets
      // the single-page app's index.html.
      fallback: [{ source: "/:path((?!api(?:/|$)).*)", destination: "/index.html" }],
    };
  },
};

export default nextConfig;
