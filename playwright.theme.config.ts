import { defineConfig, devices } from "@playwright/test";

// Deliberately production-only; the ordinary E2E suite still runs against dev.
export default defineConfig({
  testDir: "e2e/theme-bootstrap",
  timeout: 45_000,
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/theme-bootstrap",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm -F frontend start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
  },
});
