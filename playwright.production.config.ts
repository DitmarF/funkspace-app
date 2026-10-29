import { defineConfig } from "@playwright/test";
import config, { diagnosticProductionOnlyPattern } from "./playwright.config";

if (
  !Array.isArray(config.testIgnore) ||
  !config.testIgnore.includes(diagnosticProductionOnlyPattern)
) {
  throw new Error(
    "Expected the inherited production-only diagnostic ignore pattern.",
  );
}

// Run `pnpm build` first. Fail on an occupied port instead of reusing dev.
// Inherits the existing Chromium project; this does not imply cross-browser QA.
export default defineConfig({
  ...config,
  retries: 0,
  // These diagnostic-route tests run unchanged against an isolated local dev
  // fixture server; public production builds deliberately return 404.
  testIgnore: [
    ...config.testIgnore.filter(
      (pattern) => pattern !== diagnosticProductionOnlyPattern,
    ),
    "**/particle-aperture.spec.ts",
    "**/particle-lifecycle.spec.ts",
  ],
  webServer: {
    command: "pnpm -F frontend start -p 3000",
    url: "http://localhost:3000",
    reuseExistingServer: false,
  },
});
