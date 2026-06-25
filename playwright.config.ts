import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev --prefix server',
      port: 5000,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev --prefix client',
      port: 3000,
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
