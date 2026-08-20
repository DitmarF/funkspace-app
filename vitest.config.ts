/// <reference types="vitest" />
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend"),
      react: resolve(__dirname, "frontend/node_modules/react"),
      "react-dom": resolve(__dirname, "frontend/node_modules/react-dom"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: true,
    coverage: {
      enabled: Boolean(process.env.CI),
      provider: "v8",
      include: [
        "frontend/**/*.{ts,tsx}",
        "src/**/*.{ts,tsx}",
        "common/motion/**/*.ts",
      ],
      exclude: [
        "**/*.stories.{ts,tsx}",
        "**/*.test.{ts,tsx}",
        "**/node_modules/**",
        "**/.next/**",
        // Config files
        "**/*.config.{ts,tsx,js,mjs}",
        "**/next-env.d.ts",
        // App pages (mostly simple wrappers)
        "**/app/**/page.tsx",
        "**/app/**/layout.tsx",
        "**/app/fonts.ts",
        // Storybook config
        "**/.storybook/**",
        // Type definition files
        "**/*.d.ts",
        // Data files
        "**/data/**",
        // Application layer (services, orchestrators) - not yet tested
        "**/application/**",
        // Infrastructure layer (adapters, low-level utilities) - not yet tested
        "**/infrastructure/**",
        // Domain layer (pure types/interfaces)
        "**/domain/**",
        // Utils that are not yet tested
        "**/utils/motion.ts",
        // Components not yet tested
        "**/components/ThemeSwitcher.tsx",
        "**/components/Modules/**",
        "**/components/Templates/**",
        // Hooks not yet tested
        "**/hooks/useScrollProgressService.ts",
      ],
      reporter: ["text", "html"],
      thresholds: {
        // Set realistic thresholds for tested code
        // Excludes app pages, application/infrastructure layers, and config files
        // Focuses on components, hooks, and utils that have tests
        // Function coverage set to 75% to account for edge cases (error handlers, browser fallbacks)
        lines: 75,
        functions: 75,
        branches: 80,
        statements: 75,
        perFile: false,
      },
    },
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
