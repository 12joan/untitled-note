import { expect, test } from '@playwright/test';
import { createProject, locateTopBar, logIn } from './utils';

test.describe('Long user strings', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await page.setViewportSize({ width: 1440, height: 810 });
    await createProject(page, 'a'.repeat(400));
  });

  test('Long project names are truncated in top bar', async ({ page }) => {
    const boundingBox = await locateTopBar(page).boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(1440);
  });
});
