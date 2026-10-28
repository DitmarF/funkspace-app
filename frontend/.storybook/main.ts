import type { StorybookConfig } from "@storybook/nextjs-vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareStorybookPublic } from "./public-assets";

const getAbsolutePath = (value: string): string =>
  dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../features/contact/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    fileURLToPath(new URL("./design-token-preset.cjs", import.meta.url)),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    const mode = configType === "PRODUCTION" ? "production" : "development";

    // Contact stories use the same frontend alias as the actual application.
    const frontendRoot = fileURLToPath(new URL("../", import.meta.url));
    // The design-token addon writes generated JSON into Vite's publicDir.
    // Give Storybook a disposable copy so it cannot alter Next's public assets.
    const isolatedPublic = prepareStorybookPublic(join(frontendRoot, "public"));
    config.publicDir = isolatedPublic.publicDir;
    config.plugins ??= [];
    config.plugins.push(isolatedPublic.plugin);
    config.resolve ??= {};
    config.resolve.alias = Array.isArray(config.resolve.alias)
      ? [...config.resolve.alias, { find: "@", replacement: frontendRoot }]
      : { ...config.resolve.alias, "@": frontendRoot };

    config.define = {
      ...(config.define ?? {}),
      "process.env.NODE_ENV": JSON.stringify(mode),
      __DEV__: configType !== "PRODUCTION",
    };

    return config;
  },
};

export default config;
