/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e", // keeps unit vs e2e separate
  timeout: 30_000,
  expect: { timeout: 5_000 },

  retries: process.env.CI ? 2 : 0, // flaky-test shield in CI
  reporter: process.env.CI ? "dot" : "html",

  use: {
    baseURL: "http://localhost:3000", // so tests can `page.goto('/')`
    trace: "on-first-retry", // Trace on retry (CI-friendly)
    video: "retain-on-failure", // Save video on failure
    screenshot: "only-on-failure", // Save screenshot on failure
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm -F frontend dev -p 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
