import type { StorybookConfig } from "@storybook/nextjs-vite";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const getAbsolutePath = (value: string): string =>
  dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("storybook-design-token"),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config, { configType }) => {
    const mode = configType === "PRODUCTION" ? "production" : "development";

    config.define = {
      ...(config.define ?? {}),
      "process.env.NODE_ENV": JSON.stringify(mode),
      __DEV__: configType !== "PRODUCTION",
    };

    return config;
  },
};

export default config;
