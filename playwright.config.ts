import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwrightの設定ファイル
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テスト実行のタイムアウト時間
  timeout: 30000,
  // テストファイルのパターン
  testDir: './tests/e2e',
  // テストファイルの命名規則
  testMatch: '**/*.spec.ts',
  // 失敗したテストの再試行回数
  retries: process.env.CI ? 2 : 0,
  // テスト実行の並列数
  workers: process.env.CI ? 1 : undefined,
  // レポーターの設定
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  // スクリーンショットの保存先
  outputDir: 'tests/e2e/screenshots/results',
  
  // テスト実行前の共通設定
  use: {
    // ベースURL
    baseURL: 'http://localhost:3000',
    // すべてのテストでトレースを取得
    trace: 'on-first-retry',
    // スクリーンショットを自動的に撮影
    screenshot: 'only-on-failure',
  },

  // プロジェクト別の設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
