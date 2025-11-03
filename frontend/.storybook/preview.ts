import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "../app/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        default: "",
        dark: "dark",
        muted: "muted",
        highContrast: "dark-high-contrast",
      },
      defaultTheme: "default",
      attributeName: "data-theme",
      parentSelector: "body",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    designToken: {
      files: {
        css: ["../../styles/tokens.css"],
      },
    },
  },
};

export default preview;
