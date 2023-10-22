import { expect, test } from '@playwright/test';
import {
  clickAtPath,
  getEditorHandle,
  getSlateNodeByPath,
  setSelection,
} from './slate';
import { createDocument, createProject, logIn } from './utils';

test.describe('Links', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);

    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('The quick brown fox jumps over the lazy dog');
    await page.keyboard.press('Enter');

    // Select 'brown'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 0], offset: 10 },
      focus: { path: [0, 0], offset: 15 },
    });

    await page.keyboard.press('Meta+Shift+U');
    await page.keyboard.type('https://example.com');
    await page.keyboard.press('Enter');

    // Put cursor inside link
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 1, 0], offset: 2 },
      focus: { path: [0, 1, 0], offset: 2 },
    });
  });

  test('remove link with floating toolbar', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    await page.getByTestId('link-toolbar').getByLabel('Remove link').click();

    const textNodeHandle = await getSlateNodeByPath(page, editorHandle, [0, 0]);
    const { text } = await textNodeHandle.jsonValue();

    expect(text).toBe('The quick brown fox jumps over the lazy dog');
  });

  test('remove link with keyboard shortcut', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    await page.keyboard.press('Meta+Shift+U');

    const textNodeHandle = await getSlateNodeByPath(page, editorHandle, [0, 0]);
    const { text } = await textNodeHandle.jsonValue();

    expect(text).toBe('The quick brown fox jumps over the lazy dog');
  });

  test('tab into floating toolbar', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Focus edit button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Enter');

    await page.getByLabel('Text').fill('red');
    await page.keyboard.press('Enter');

    const textNodeHandle = await getSlateNodeByPath(
      page,
      editorHandle,
      [0, 1, 0]
    );
    const { text } = await textNodeHandle.jsonValue();

    expect(text).toBe('red');
  });

  test('show floating toolbar on hover', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);
    const link = page.getByRole('link', { name: 'brown' });
    const linkToolbar = page.getByTestId('link-toolbar');

    // Click outside link
    await clickAtPath(page, editorHandle, [1]);
    await expect(linkToolbar).not.toBeVisible();

    // Hover over link
    await link.hover();
    await expect(linkToolbar).toBeVisible();

    // Hover elsewhere
    await page.mouse.move(0, 0);
    await expect(linkToolbar).not.toBeVisible();
  });
});
