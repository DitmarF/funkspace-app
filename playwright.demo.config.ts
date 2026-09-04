import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e/wave-survivor",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm --filter @funkspace/wave-survivor demo",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
