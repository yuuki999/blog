import { test, expect } from '@playwright/test';
import { takeScreenshot, expectTextVisible, waitForElement } from '../utils/test-utils';

/**
 * u30d6u30edu30b0u30dau30fcu30b8u306eu57fau672cu6a5fu80fdu3092u30c6u30b9u30c8u3059u308bu30c6u30b9u30c8u30b9u30a4u30fcu30c8
 */
test.describe('u30d6u30edu30b0u30dau30fcu30b8u30c6u30b9u30c8', () => {
  
  // u5404u30c6u30b9u30c8u306eu524du306bu5b9fu884cu3055u308cu308bu51e6u7406
  test.beforeEach(async ({ page }) => {
    // u30c8u30c3u30d7u30dau30fcu30b8u306bu30a2u30afu30bbu30b9
    await page.goto('/');
    
    // u30c8u30c3u30d7u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu308bu3053u3068u3092u78bau8a8d
    await expect(page).toHaveTitle(/HARU TECHNOLOGY/);
  });

  // u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u306eu30c6u30b9u30c8
  test('u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu308b', async ({ page }) => {
    // u30d8u30c3u30c0u30fcu306eu30d6u30edu30b0u30eau30f3u30afu3092u30afu30eau30c3u30af
    await page.click('text=Blog');
    
    // u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u304cu8868u793au3055u308cu308bu3053u3068u3092u78bau8a8d
    await expect(page).toHaveURL(/\/blog/);
    
    // u30dau30fcu30b8u30bfu30a4u30c8u30ebu3092u78bau8a8d
    await expect(page).toHaveTitle(/Blog/);
    
    // u30b9u30afu30eau30fcu30f3u30b7u30e7u30c3u30c8u3092u64aeu5f71
    await takeScreenshot(page, 'blog-pages', 'blog-list-page');
    
    console.log('u30c6u30b9u30c8u6210u529f: u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu307eu3059');
  });

  // u30d6u30edu30b0u8a18u4e8bu304cu3042u308cu3070u3001u6700u521du306eu8a18u4e8bu3092u30afu30eau30c3u30afu3057u3066u8a73u7d30u30dau30fcu30b8u3092u30c6u30b9u30c8
  test('u30d6u30edu30b0u8a18u4e8bu8a73u7d30u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu308b', async ({ page }) => {
    // u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u306bu30a2u30afu30bbu30b9
    await page.goto('/blog');
    
    // u30d6u30edu30b0u8a18u4e8bu304cu3042u308bu304bu78bau8a8du3057u3001u3042u308cu3070u6700u521du306eu8a18u4e8bu3092u30afu30eau30c3u30af
    const articleExists = await page.locator('article').first().isVisible().catch(() => false);
    
    if (articleExists) {
      // u6700u521du306eu8a18u4e8bu306eu30bfu30a4u30c8u30ebu3092u30afu30eau30c3u30af
      await page.locator('article').first().locator('h2 a').click();
      
      // u8a18u4e8bu8a73u7d30u30dau30fcu30b8u306bu9077u79fbu3057u305fu3053u3068u3092u78bau8a8d
      await expect(page).toHaveURL(/\/blog\/[\w-]+/);
      
      // u30b9u30afu30eau30fcu30f3u30b7u30e7u30c3u30c8u3092u64aeu5f71
      await takeScreenshot(page, 'blog-pages', 'blog-detail-page');
      
      console.log('u30c6u30b9u30c8u6210u529f: u30d6u30edu30b0u8a18u4e8bu8a73u7d30u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu307eu3059');
    } else {
      // u8a18u4e8bu304cu306au3044u5834u5408u306fu30c6u30b9u30c8u3092u30b9u30adu30c3u30d7
      console.log('u30d6u30edu30b0u8a18u4e8bu304cu898bu3064u304bu3089u306au3044u305fu3081u3001u8a73u7d30u30dau30fcu30b8u30c6u30b9u30c8u3092u30b9u30adu30c3u30d7u3057u307eu3059');
      test.skip();
    }
  });

  // u30bfu30b0u6a5fu80fdu306eu30c6u30b9u30c8
  test('u30bfu30b0u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu308b', async ({ page }) => {
    // u30d6u30edu30b0u4e00u89a7u30dau30fcu30b8u306bu30a2u30afu30bbu30b9
    await page.goto('/blog');
    
    // u30bfu30b0u304cu3042u308bu304bu78bau8a8d
    const tagExists = await page.locator('a[href^="/blog/tag/"]').first().isVisible().catch(() => false);
    
    if (tagExists) {
      // u6700u521du306eu30bfu30b0u3092u30afu30eau30c3u30af
      await page.locator('a[href^="/blog/tag/"]').first().click();
      
      // u30bfu30b0u30dau30fcu30b8u306bu9077u79fbu3057u305fu3053u3068u3092u78bau8a8d
      await expect(page).toHaveURL(/\/blog\/tag\/[\w-]+/);
      
      // u30b9u30afu30eau30fcu30f3u30b7u30e7u30c3u30c8u3092u64aeu5f71
      await takeScreenshot(page, 'blog-pages', 'tag-page');
      
      console.log('u30c6u30b9u30c8u6210u529f: u30bfu30b0u30dau30fcu30b8u304cu6b63u3057u304fu8868u793au3055u308cu307eu3059');
    } else {
      // u30bfu30b0u304cu306au3044u5834u5408u306fu30c6u30b9u30c8u3092u30b9u30adu30c3u30d7
      console.log('u30bfu30b0u304cu898bu3064u304bu3089u306au3044u305fu3081u3001u30bfu30b0u30dau30fcu30b8u30c6u30b9u30c8u3092u30b9u30adu30c3u30d7u3057u307eu3059');
      test.skip();
    }
  });
});
