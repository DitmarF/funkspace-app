import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  // A local production build must not overwrite a running dev server's chunks.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  transpilePackages: ["@funkspace/common", "@funkspace/wave-survivor"],
  // Keep internal diagnostics in local development; production resolves them
  // through the ordinary not-found route before matching the diagnostic pages.
  ...(phase === PHASE_DEVELOPMENT_SERVER
    ? {}
    : {
        async rewrites() {
          return {
            beforeFiles: [
              {
                source: "/sandbox/:path*",
                destination: "/__diagnostic-not-found",
              },
              { source: "/typography", destination: "/__diagnostic-not-found" },
            ],
            afterFiles: [],
            fallback: [],
          };
        },
      }),
  webpack: (config, { webpack }) => {
    // Exclude Storybook story files from the build
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.stories\.(ts|tsx|js|jsx)$/,
      }),
    );

    return config;
  },
});

export default nextConfig;
