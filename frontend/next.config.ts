import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@funkspace/common", "@funkspace/wave-survivor"],
  webpack: (config, { webpack }) => {
    // Exclude Storybook story files from the build
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.stories\.(ts|tsx|js|jsx)$/,
      }),
    );

    return config;
  },
};

export default nextConfig;
