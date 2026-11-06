import { defineConfig } from "@playwright/test"
import dotenv from "dotenv"

// Use a dedicated test DB. Keep secrets out of this repository.
dotenv.config({ path: process.env.CI ? ".env.test" : ".env.local", quiet: true })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for E2E tests; use an isolated test database")
}

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "html" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    // Production build avoids Fast Refresh/HMR interrupting Server Action redirects.
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      FSO_E2E_TEST: "true",
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "",
      AUTH_URL: "http://localhost:3000",
    },
  },
})
