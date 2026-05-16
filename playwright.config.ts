import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // ── Mobile ─────────────────────────────────────────────────────
    { name: 'iPhone 14',  use: { ...devices['iPhone 14'] } },
    { name: 'Pixel 7',    use: { ...devices['Pixel 7'] } },
    { name: 'iPad Mini',  use: { ...devices['iPad Mini'] } },
    // ── Desktop ─────────────────────────────────────────────────────
    { name: 'Chrome 1920', use: { channel: 'chrome', viewport: { width: 1920, height: 1080 } } },
    { name: 'Chrome 1366', use: { channel: 'chrome', viewport: { width: 1366, height: 768 } } },
    { name: 'Firefox',     use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
