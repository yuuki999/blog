import { test, expect } from '@playwright/test';
import { takeScreenshot, expectAuthError } from '../utils/test-utils';

/**
 * Admin画面の認証機能をテストするテストスイート
 */
test.describe('Admin認証テスト', () => {
  
  // 各テストの前に実行される処理
  test.beforeEach(async ({ page }) => {
    // トップページにアクセス
    await page.goto('/');
    
    // トップページが正しく表示されることを確認
    await expect(page).toHaveTitle(/HARU TECHNOLOGY/);
    
    // スクリーンショットを撮影
    await takeScreenshot(page, 'admin-auth', 'homepage');
  });

  // Admin画面へのアクセス時に認証が要求されることをテスト
  test('Admin画面にアクセスすると認証が要求される', async ({ page, context }) => {
    // テストの説明をコンソールに出力
    console.log('Admin画面へのアクセスをテストします');
    
    try {
      // Basic認証ダイアログを検出するためのイベントリスナーを設定
      context.on('dialog', dialog => {
        console.log('認証ダイアログが検出されました:', dialog.type());
        // ダイアログを閉じる（認証情報は入力しない）
        dialog.dismiss().catch(() => {});
      });
      
      // Admin画面にアクセスを試みる
      // 認証情報なしではエラーが発生するはず
      console.log('Admin画面へのアクセスを試みます...');
      const navigationPromise = page.goto('/admin', { timeout: 10000 });
      
      // 認証エラーが発生する可能性があるため、エラーをキャッチする
      const response = await navigationPromise.catch(e => {
        console.log('ナビゲーションエラーが発生しました（認証エラーの可能性）:', e.message);
        return null;
      });
      
      // スクリーンショットを撮影して保存（エラーページでも撮影できるように）
      await takeScreenshot(page, 'admin-auth', 'admin-access-attempt').catch(e => {
        console.log('スクリーンショット撮影エラー:', e.message);
      });
      
      // レスポンスがあれば、ステータスコードをチェック
      if (response) {
        const status = response.status();
        console.log('レスポンスステータス:', status);
        
        // 401または403はそれ自体が認証エラーを示す
        if (status === 401 || status === 403) {
          console.log('認証エラーを確認: ステータスコード', status);
          return;
        }
      }
      
      // 認証エラーが発生したことを確認（改善された検出方法）
      await expectAuthError(page);
      
      console.log('テスト成功: Admin画面にアクセスすると認証が要求されます');
    } catch (error) {
      console.error('テスト失敗:', error);
      throw error;
    }
  });

  // 他のページは認証なしでアクセスできることをテスト
  test('ブログページは認証なしでアクセスできる', async ({ page }) => {
    // ブログページにアクセス
    await page.goto('/blog');
    
    // ページが正しく表示されることを確認
    await expect(page).toHaveTitle(/Blog/);
    
    // スクリーンショットを撮影
    await takeScreenshot(page, 'admin-auth', 'blog-page-access');
    
    console.log('テスト成功: ブログページは認証なしでアクセスできます');
  });
});