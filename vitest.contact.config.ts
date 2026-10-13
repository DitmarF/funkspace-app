import { defineConfig } from "vitest/config";
import base from "./vitest.config";

export default defineConfig({
  ...base,
  test: {
    ...base.test,
    environment: "node",
    setupFiles: [],
    include: [
      "frontend/domain/contact/*.test.ts",
      "frontend/application/contact/*.test.ts",
      "frontend/infrastructure/contact/*.test.ts",
      "frontend/infrastructure/services/createContactServerServices.test.ts",
      "frontend/app/api/contact/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      include: [
        "frontend/domain/contact/ContactValidation.ts",
        "frontend/domain/contact/ContactBrowserResponse.ts",
        "frontend/application/contact/SubmitContact.ts",
        "frontend/infrastructure/contact/*.ts",
        "frontend/infrastructure/services/createContactServerServices.ts",
        "frontend/app/api/contact/route.ts",
      ],
      exclude: ["**/*.test.ts"],
      reportsDirectory: "coverage/contact",
      reporter: ["text", "json-summary"],
      thresholds: {
        statements: 95,
        lines: 95,
        branches: 90,
        functions: 80,
      },
    },
  },
});
