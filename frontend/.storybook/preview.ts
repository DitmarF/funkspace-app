import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { createElement } from "react";

import "../app/globals.css";

if (process.env.NODE_ENV !== "production") {
  const reactElementPrototype = Object.getPrototypeOf(createElement("div"));

  if (reactElementPrototype && reactElementPrototype !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(
      reactElementPrototype,
      "ref",
    );

    if (descriptor) {
      Object.defineProperty(reactElementPrototype, "ref", {
        configurable: true,
        get() {
          return (this as unknown as { props?: Record<string, unknown> })
            .props?.["ref"];
        },
        set(value) {
          const element = this as unknown as {
            props?: Record<string, unknown>;
          };
          if (!element.props) {
            element.props = { ref: value };
          } else {
            element.props.ref = value;
          }
        },
      });
    }
  }
}

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
