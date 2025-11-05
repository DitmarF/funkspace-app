import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "var(--font-work-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-space-grotesk)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      transitionDuration: {
        100: "var(--fs-motion-duration-100)",
        200: "var(--fs-motion-duration-200)",
        400: "var(--fs-motion-duration-400)",
        800: "var(--fs-motion-duration-800)",
        quick: "var(--fs-motion-duration-quick)",
        normal: "var(--fs-motion-duration-normal)",
        slow: "var(--fs-motion-duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--fs-motion-ease-standard)",
        emph: "var(--fs-motion-ease-emph)",
        linear: "var(--fs-motion-easing-linear)",
        "ease-out": "var(--fs-motion-easing-ease-out)",
        "ease-in-out": "var(--fs-motion-easing-ease-in-out)",
      },
      colors: {
        // Primitive Colors
        "fs-red": "var(--fs-color-red)",
        "fs-vermilion": "var(--fs-color-vermilion)",
        "fs-orange": "var(--fs-color-orange)",
        "fs-amber": "var(--fs-color-amber)",
        "fs-yellow": "var(--fs-color-yellow)",
        "fs-green": "var(--fs-color-green)",
        "fs-cyan": "var(--fs-color-cyan)",
        "fs-blue": "var(--fs-color-blue)",
        "fs-violet": "var(--fs-color-violet)",
        "fs-magenta": "var(--fs-color-magenta)",
        "fs-white": "var(--fs-color-white)",
        "fs-black": "var(--fs-color-black)",
        "fs-chartreuse": "var(--fs-color-chartreuse)",
        "fs-indigo": "var(--fs-color-indigo)",
        // Grey scale
        "fs-grey": {
          DEFAULT: "var(--fs-color-grey)",
          "bright-1": "var(--fs-color-grey-bright-1)",
          "bright-2": "var(--fs-color-grey-bright-2)",
          "bright-3": "var(--fs-color-grey-bright-3)",
          "bright-4": "var(--fs-color-grey-bright-4)",
          "dark-1": "var(--fs-color-grey-dark-1)",
          "dark-2": "var(--fs-color-grey-dark-2)",
          "dark-3": "var(--fs-color-grey-dark-3)",
          "dark-4": "var(--fs-color-grey-dark-4)",
        },
        // Surface Colors
        "fs-surface": {
          background: "var(--fs-color-surface-background)",
          "elevation-1": "var(--fs-color-surface-elevation-1)",
          "elevation-2": "var(--fs-color-surface-elevation-2)",
          overlay: "var(--fs-color-surface-overlay)",
        },
        // Content Colors
        "fs-content": {
          inverse: "var(--fs-color-content-inverse)",
          "elevation-2": "var(--fs-color-content-elevation-2)",
          "elevation-1": "var(--fs-color-content-elevation-1)",
          primary: "var(--fs-color-content-primary)",
          disabled: "var(--fs-color-content-disabled)",
        },
        // Action Colors
        "fs-action": {
          primary: "var(--fs-color-action-primary)",
          hover: "var(--fs-color-action-hover)",
          link: "var(--fs-color-action-link)",
          disabled: "var(--fs-color-action-disabled)",
        },
        // Feedback Colors
        "fs-feedback": {
          success: "var(--fs-color-feedback-success)",
          warning: "var(--fs-color-feedback-warning)",
          error: "var(--fs-color-feedback-error)",
          info: "var(--fs-color-feedback-info)",
        },
        // Border Colors
        "fs-border": {
          subtle: "var(--fs-color-border-subtle)",
          strong: "var(--fs-color-border-strong)",
          focus: "var(--fs-color-border-focus)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
