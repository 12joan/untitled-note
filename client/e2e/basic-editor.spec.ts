import { expect, test } from '@playwright/test';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
} from '@udecode/plate';
import {
  clickAtPath,
  getEditable,
  getEditorHandle,
  getTypeAtPath,
} from './slate';
import {
  createDocument,
  createProject,
  expectUpToDate,
  logIn,
  openSettingsModal,
} from './utils';

test.describe('Basic editor', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);
  });

  test('no page scrollbars', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.waitForTimeout(1000);

    const hasScrollbars = await page.evaluate(() => {
      const html = document.querySelector('html')!;

      return {
        horizontal: html.scrollWidth > html.clientWidth,
        vertical: html.scrollHeight > html.clientHeight,
      };
    });

    expect(hasScrollbars).toEqual({
      horizontal: false,
      vertical: false,
    });
  });

  test('sufficient scroll padding', async ({ page }) => {
    const expectScrolledToBottom = async () => {
      const { scrollHeight, scrollTop, clientHeight } = await page.evaluate(
        () => {
          const html = document.querySelector('html')!;
          return {
            scrollHeight: html.scrollHeight,
            scrollTop: html.scrollTop,
            clientHeight: html.clientHeight,
          };
        }
      );

      expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 1);
    };

    const testScrollPadding = async () => {
      const editorHandle = await getEditorHandle(page);
      await clickAtPath(page, editorHandle, [0]);

      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('Enter');
        await page.keyboard.type('a');
        await page.waitForTimeout(50);
      }

      await expectScrolledToBottom();

      for (let i = 0; i < 120; i++) {
        await page.keyboard.type('a');
        await page.waitForTimeout(20);
      }

      await expectScrolledToBottom();
    };

    await testScrollPadding();

    await createDocument(page);

    await openSettingsModal(page);
    const increaseFontSizeButton = page.getByLabel('Increase font size');
    await increaseFontSizeButton.click();
    await increaseFontSizeButton.click();
    await increaseFontSizeButton.click();
    await increaseFontSizeButton.click();
    await page.keyboard.press('Escape');

    await testScrollPadding();
  });

  test('save document to server and reload', async ({ page }) => {
    const editable = getEditable(page);
    const editorHandle = await getEditorHandle(page, editable);

    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('Hello World!');
    await expect(editable).toContainText('Hello World!');

    await expectUpToDate(page);

    await page.reload();
    await expect(getEditable(page)).toContainText('Hello World!');
  });

  test('create blocks with markdown and remove with backspace', async ({
    page,
  }) => {
    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);

    const expectType = async (type: string) =>
      expect(await getTypeAtPath(page, editorHandle, [0])).toEqual(type);

    const cases = [
      [ELEMENT_H1, '# '],
      [ELEMENT_BLOCKQUOTE, '> '],
      [ELEMENT_CODE_BLOCK, '```'],
      [ELEMENT_UL, '- '],
      [ELEMENT_OL, '1. '],
    ];

    for (const [type, markdown] of cases) {
      await page.keyboard.type(markdown);
      await expectType(type);

      await page.keyboard.type('a');
      await page.keyboard.press('Backspace');
      await expectType(type);

      await page.keyboard.press('Backspace');
      await expectType(ELEMENT_PARAGRAPH);
    }
  });
});
