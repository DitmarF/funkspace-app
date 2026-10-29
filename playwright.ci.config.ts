import { defineConfig } from "@playwright/test";
import { isAbsolute, join } from "node:path";
import production from "./playwright.production.config";
import theme from "./playwright.theme.config";
import storybook from "./playwright.storybook.config";
import demo from "./playwright.demo.config";

// Only the CI launcher changes: retain each existing suite's test selection,
// assertions, browser, timeouts and retry policy.
const suite = process.env.FS_CI_SUITE;
if (!["production", "theme", "storybook", "demo"].includes(suite ?? ""))
  throw new Error("Set FS_CI_SUITE to production, theme, storybook or demo.");
const output = process.env.FS_CI_PHASE_OUTPUT;
if (!output || !isAbsolute(output))
  throw new Error(
    "Set FS_CI_PHASE_OUTPUT to the isolated phase evidence directory.",
  );

const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'";
const staticStorybook = [
  process.execPath,
  join(__dirname, "scripts/serve-contact-preview.mjs"),
  "--dir",
  join(__dirname, "frontend/storybook-static"),
  "--host",
  "127.0.0.1",
  "--port",
  "6006",
]
  .map(quote)
  .join(" ");

const configurations = {
  production: {
    ...production,
    webServer: {
      command: "pnpm -F frontend start -H 127.0.0.1 -p 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: false,
    },
  },
  theme: {
    ...theme,
    webServer: {
      command: "pnpm -F frontend start -H 127.0.0.1 -p 3100",
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
    },
  },
  storybook: {
    ...storybook,
    webServer: {
      command: staticStorybook,
      url: "http://127.0.0.1:6006/index.json",
      reuseExistingServer: false,
    },
  },
  demo: {
    ...demo,
    webServer: {
      // Retain the existing demo's standalone build, without a host-wide bind.
      command:
        "pnpm --filter @funkspace/wave-survivor build && pnpm --filter @funkspace/wave-survivor exec vite demo --host 127.0.0.1 --port 5173 --strictPort",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: false,
    },
  },
};

export default defineConfig({
  ...configurations[suite as keyof typeof configurations],
  // The CI launcher supplies a fresh per-command evidence directory; no prior
  // output can be mistaken for evidence from this run or cleared by it.
  outputDir: join(output, "playwright-results"),
});
