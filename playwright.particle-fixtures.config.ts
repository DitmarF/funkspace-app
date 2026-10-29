import { defineConfig } from "@playwright/test";
import { join } from "node:path";
import config from "./playwright.config";

// Dedicated ephemeral fixture server, launched only by the isolated CI runner.
// Keep the original fixture tests and assertions while public builds reject them.
const output = process.env.FS_CI_PHASE_OUTPUT;
if (!output) throw new Error("Set FS_CI_PHASE_OUTPUT for fixture evidence.");

export default defineConfig({
  ...config,
  retries: 0,
  testMatch: ["particle-aperture.spec.ts", "particle-lifecycle.spec.ts"],
  outputDir: join(output, "playwright-results"),
  webServer: {
    command: "pnpm -F frontend dev -H 127.0.0.1 -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
  },
});
