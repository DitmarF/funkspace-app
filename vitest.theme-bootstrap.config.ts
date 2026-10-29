import { defineConfig } from "vitest/config";
import base from "./vitest.config";

export default defineConfig({
  ...base,
  test: {
    ...base.test,
    include: [
      "frontend/infrastructure/theme/*.test.ts",
      "frontend/infrastructure/dom/DOMAdapter.test.ts",
      "frontend/application/providers/ThemeBootstrapScript.test.tsx",
      "frontend/application/theme/ThemeService.test.ts",
      "scripts/build-theme-bootstrap.test.mjs",
    ],
    coverage: {
      provider: "v8",
      include: [
        "frontend/infrastructure/theme/themeBootstrap.ts",
        "frontend/infrastructure/dom/DOMAdapter.ts",
        "frontend/application/providers/ThemeBootstrapScript.tsx",
      ],
      exclude: [],
      reportsDirectory: "coverage/theme-bootstrap",
      reporter: ["text", "html", "json-summary"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
