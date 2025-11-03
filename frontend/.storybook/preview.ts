import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

import "../app/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Light: "",
        Dark: "dark",
        Muted: "muted",
        "Dark High Contrast": "dark-high-contrast",
      },
      defaultTheme: "Light",
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
