import { defineConfig } from "@playwright/test";
import { join } from "node:path";
import config from "./playwright.config";

// Dedicated ephemeral fixture server, launched only by the isolated CI runner.
// Keep the original fixture tests and assertions while public builds reject them.
const output = process.env.FS_CI_PHASE_OUTPUT;
if (!output) throw new Error("Set FS_CI_PHASE_OUTPUT for fixture evidence.");
const guard = process.env.FS_CI_EGRESS_GUARD;
const nodeOptions = process.env.NODE_OPTIONS;
if (!guard || !nodeOptions?.includes(`--require=${guard}`))
  throw new Error("Particle fixtures require the isolated CI egress guard.");

export default defineConfig({
  ...config,
  retries: 0,
  testMatch: ["particle-aperture.spec.ts", "particle-lifecycle.spec.ts"],
  outputDir: join(output, "playwright-results"),
  webServer: {
    command: "pnpm -F frontend dev -H 127.0.0.1 -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    // Only the fixture server gets the offline Next version lookup. The
    // existing transport guard remains first and covers all other requests.
    env: {
      NODE_OPTIONS: `${nodeOptions} --require=${join(__dirname, "scripts/ci-fixture-next-offline.cjs")}`,
    },
  },
});
