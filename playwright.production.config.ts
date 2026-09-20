import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// Run `pnpm build` first. Fail on an occupied port instead of reusing dev.
// Inherits the existing Chromium project; this does not imply cross-browser QA.
export default defineConfig({
  ...config,
  retries: 0,
  webServer: {
    command: "pnpm -F frontend start -p 3000",
    url: "http://localhost:3000",
    reuseExistingServer: false,
  },
});
