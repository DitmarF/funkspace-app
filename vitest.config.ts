/// <reference types="vitest" />
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "frontend/src"),
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
      include: ["frontend/src/**/*.{ts,tsx}"],
      reporter: ["text", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        perFile: false,
      },
    },
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
