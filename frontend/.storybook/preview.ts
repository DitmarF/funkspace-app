import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { createElement, useEffect, type ReactNode } from "react";
import React from "react";
import {
  ServiceProvider,
  useServices,
} from "../application/providers/ServiceProvider";
import type { Theme } from "../domain/theme/Theme";

import "../app/globals.css";
import { workSans, spaceGrotesk } from "../app/fonts";

document.documentElement.classList.add(
  workSans.variable,
  spaceGrotesk.variable,
);

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

const storybookThemes: Record<string, Theme> = {
  default: "system",
  light: "default",
  dark: "dark",
  muted: "muted",
  highContrast: "dark-high-contrast",
};

function StorybookTheme({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  const { themeService } = useServices();
  // The empty body theme inherits root variables. Keep the existing service's
  // root selection aligned so explicit light cannot inherit system dark.
  useEffect(() => themeService.setTheme(theme), [theme, themeService]);
  return children;
}

const preview: Preview = {
  decorators: [
    (Story, context) =>
      createElement(
        ServiceProvider,
        null,
        createElement(StorybookTheme, {
          theme: storybookThemes[context.globals.theme] ?? "system",
          children: createElement(Story),
        }),
      ),
    withThemeByDataAttribute({
      themes: {
        default: "",
        light: "",
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
