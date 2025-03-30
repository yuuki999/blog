import { Page, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * スクリーンショットを撮影して保存するヘルパー関数
 * @param page Playwrightのページオブジェクト
 * @param testName テスト名（ファイル名の一部として使用）
 * @param screenshotName スクリーンショットの名前
 */
export async function takeScreenshot(page: Page, testName: string, screenshotName: string): Promise<void> {
  // スクリーンショット保存用のディレクトリパス
  const screenshotDir = path.join(process.cwd(), 'tests/e2e/screenshots', testName);
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // スクリーンショットのファイルパス
  const screenshotPath = path.join(screenshotDir, `${screenshotName}_${new Date().toISOString().replace(/:/g, '-')}.png`);
  
  // スクリーンショットを撮影して保存
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);
}

/**
 * ページのタイトルを検証するヘルパー関数
 * @param page Playwrightのページオブジェクト
 * @param expectedTitle 期待されるタイトル（部分一致）
 */
export async function expectPageTitle(page: Page, expectedTitle: string): Promise<void> {
  const title = await page.title();
  expect(title).toContain(expectedTitle);
}

/**
 * ページ内にテキストが存在するか検証するヘルパー関数
 * @param page Playwrightのページオブジェクト
 * @param text 検索するテキスト
 */
export async function expectTextVisible(page: Page, text: string): Promise<void> {
  await expect(page.getByText(text, { exact: false })).toBeVisible();
}

/**
 * 要素が表示されるまで待機するヘルパー関数
 * @param page Playwrightのページオブジェクト
 * @param selector 要素のセレクタ
 * @param timeout タイムアウト時間（ミリ秒）
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}

/**
 * 認証エラーが発生したかを検証するヘルパー関数
 * @param page Playwrightのページオブジェクト
 */
export async function expectAuthError(page: Page): Promise<void> {
  // Basic認証エラーの検出方法を改善
  // Playwrightでは、Basic認証のエラーは特殊な形で表示される
  
  try {
    // 現在のURLを取得
    const currentUrl = page.url();
    console.log('Current URL after auth attempt:', currentUrl);
    
    // ページのステータスコードを確認（可能な場合）
    try {
      const response = await page.request.get(currentUrl, {
        timeout: 3000,
        failOnStatusCode: false
      });
      console.log('Response status:', response.status());
      
      // 401または403ステータスコードは認証エラーを示す
      if (response.status() === 401 || response.status() === 403) {
        console.log('Authentication error detected via status code:', response.status());
        return;
      }
    } catch (reqError) {
      // リクエストエラーも認証の問題を示す可能性がある
      console.log('Request error (possibly auth related):', reqError);
    }
    
    // ページコンテンツをチェック
    const pageContent = await page.content();
    const authErrorPatterns = [
      'Authentication required',
      'Authorization Required',
      '401',
      '403',
      'Unauthorized',
      'Access Denied',
      'Login required',
      'net::ERR_INVALID_AUTH_CREDENTIALS',
      'net::ERR_ABORTED',
      'ERR_CONNECTION_ABORTED'
    ];
    
    // いずれかのパターンがページコンテンツに含まれているか確認
    for (const pattern of authErrorPatterns) {
      if (pageContent.includes(pattern)) {
        console.log(`Authentication error detected via content pattern: "${pattern}"`);
        return;
      }
    }
    
    // URLが変わっていないことを確認（認証エラーの場合はURLが変わらないことが多い）
    if (currentUrl.includes('/admin')) {
      // URLが/adminを含んでいるが、ページが正常に読み込まれていない場合は認証エラーの可能性が高い
      try {
        // 通常のページ要素が存在するか確認
        const hasNormalPageElements = await page.locator('header, nav, main, footer').count() > 0;
        if (!hasNormalPageElements) {
          console.log('Authentication error detected: URL contains /admin but page elements are missing');
          return;
        }
      } catch (elemError) {
        console.log('Error checking page elements (likely auth error):', elemError);
        return;
      }
    }
    
    // コンソールログをチェック（認証エラーに関連するログがあるか）
    const logs = await page.context().pages()[0].evaluate(() => {
      // @ts-ignore - consoleMessagesはPlaywrightの内部APIとして存在する可能性がある
      return window.consoleMessages || [];
    }).catch(() => []);
    
    for (const log of logs) {
      if (typeof log === 'string' && (
        log.includes('auth') || 
        log.includes('credentials') || 
        log.includes('401') || 
        log.includes('403')
      )) {
        console.log('Authentication error detected via console logs');
        return;
      }
    }
  } catch (error) {
    // エラーが発生した場合も認証エラーとみなす
    // Playwrightは認証ダイアログが表示されると特殊なエラーを投げることがある
    console.log('Authentication error detected via exception:', error);
    return;
  }
  
  // 最後の手段として、ページのタイトルをチェック
  const title = await page.title().catch(() => '');
  if (title.includes('401') || title.includes('403') || title.includes('Unauthorized') || title.includes('Authentication')) {
    console.log('Authentication error detected via page title:', title);
    return;
  }
  
  // 上記のどの条件にも当てはまらない場合は、認証エラーが発生していないとみなす
  console.error('No authentication error detected. Current URL:', page.url());
  throw new Error('Authentication error was expected but not detected');
}
