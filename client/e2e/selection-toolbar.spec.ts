import { expect, test } from '@playwright/test';
import { MARK_BOLD } from '~/lib/editor/plate';
import {
  addMark,
  clickAtPath,
  getEditable,
  getEditorHandle,
  getSlateNodeByPath,
  setSelection,
} from './slate';
import { createDocument, createProject, logIn } from './utils';

test.describe('Selection toolbar', () => {
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
  });

  test('activate button with keyboard', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Focus and activate bold button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    {
      const textNodeHandle = await getSlateNodeByPath(
        page,
        editorHandle,
        [0, 1]
      );

      const textNode = await textNodeHandle.jsonValue();
      expect(textNode).toMatchObject({ bold: true });
    }

    // Focus leaves the button for a brief moment; wait for it to return
    await page.waitForTimeout(1000);

    // Deactivate bold button
    await page.keyboard.press('Enter');

    {
      const textNodeHandle = await getSlateNodeByPath(
        page,
        editorHandle,
        [0, 0]
      );

      const textNode = await textNodeHandle.jsonValue();

      expect(textNode).toMatchObject({
        text: 'The quick brown fox jumps over the lazy dog',
      });
    }
  });

  test('activate button with mouse', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Activate bold button
    await page.getByTestId('selection-toolbar').getByLabel('Bold').click();

    {
      const textNodeHandle = await getSlateNodeByPath(
        page,
        editorHandle,
        [0, 1]
      );

      const textNode = await textNodeHandle.jsonValue();
      expect(textNode).toMatchObject({ bold: true });
    }

    // Deactivate bold button
    await page.getByTestId('selection-toolbar').getByLabel('Bold').click();

    {
      const textNodeHandle = await getSlateNodeByPath(
        page,
        editorHandle,
        [0, 0]
      );

      const textNode = await textNodeHandle.jsonValue();

      expect(textNode).toMatchObject({
        text: 'The quick brown fox jumps over the lazy dog',
      });
    }
  });

  test('show tooltip on hover', async ({ page }) => {
    await page.getByTestId('selection-toolbar').getByLabel('Bold').hover();
    await expect(page.getByRole('tooltip', { name: 'Bold' })).toBeVisible();

    // Prevent regression: Tooltip remains visible after deleting selected text
    await page.keyboard.press('Backspace');
    await expect(page.getByRole('tooltip', { name: 'Bold' })).not.toBeVisible();
  });

  // Prevent regression of webkit crash
  test('tab through buttons and back to editor', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Select 'fox'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 0], offset: 16 },
      focus: { path: [0, 0], offset: 19 },
    });

    // Make 'fox' bold
    await addMark(page, editorHandle, MARK_BOLD, true);

    {
      const textNodeHandle = await getSlateNodeByPath(
        page,
        editorHandle,
        [0, 1]
      );

      const textNode = await textNodeHandle.jsonValue();
      expect(textNode).toMatchObject({ bold: true });
    }

    // Do this multiple times to catch intermittent crashes
    for (let i = 0; i < 5; i++) {
      // Select 'brown'
      await setSelection(page, editorHandle, {
        anchor: { path: [0, 0], offset: 10 },
        focus: { path: [0, 0], offset: 15 },
      });

      // Tab through buttons
      const buttonCount = 5;
      const tabCount = buttonCount + 1;

      for (let i = 0; i < tabCount; i++) {
        await page.keyboard.press('Tab');
      }

      await page.waitForTimeout(100);

      // Editor should be focused
      const editable = getEditable(page);
      await expect(editable).toBeFocused();
    }
  });
});
