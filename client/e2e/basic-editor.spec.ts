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
  expectUnsavedChanges,
  expectUpToDate,
  fillDocumentTitle,
  logIn,
} from './utils';

test.describe('Basic editor', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);
  });

  test('save document to server and reload', async ({ page }) => {
    const editable = await getEditable(page);
    const editorHandle = await getEditorHandle(page, editable);

    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('Hello World!');
    await expect(editable).toContainText('Hello World!');

    await expectUnsavedChanges(page);
    await expectUpToDate(page);

    await page.reload();
    await expect(await getEditable(page)).toContainText('Hello World!');
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

  test('mention other document', async ({ page }) => {
    await fillDocumentTitle(page, 'My Document');
    await expectUpToDate(page);

    await createDocument(page, 'Other Document');
    await expectUpToDate(page);

    await page.goBack();

    const expectTitle = (title: string) =>
      expect(page.getByLabel('Document title')).toHaveValue(title);

    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);

    await page.keyboard.type('@Oth');
    await page.getByRole('option', { name: 'Other Document' }).click();

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');
    await expectTitle('Other Document');

    await page
      .getByRole('main')
      .getByRole('button', { name: 'My Document' })
      .click();
    await expectTitle('My Document');
  });
});
