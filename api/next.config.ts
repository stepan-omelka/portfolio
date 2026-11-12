import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The repo root has its own package-lock.json; pin Turbopack to this app.
  turbopack: { root: path.join(__dirname) },
  // The page routes read public/index.html and the share images. They are prerendered at build
  // time, but a project slug that doesn't exist renders on request, so the function needs them too.
  outputFileTracingIncludes: {
    "/": ["./public/index.html", "./public/og/*"],
    "/projects/*": ["./public/index.html", "./public/og/*"],
  },
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
