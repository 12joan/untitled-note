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
import { createDocument, createProject, expectUpToDate, logIn } from './utils';

test.describe('Basic editor', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);
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
