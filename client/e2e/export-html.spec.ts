import { expect, Page, test } from '@playwright/test';
import { clickAtPath, getEditable, getEditorHandle } from './slate';
import {
  createDocument,
  createProject,
  logIn,
  openExportHTMLSection,
} from './utils';

const getDocumentTitleCheckbox = (page: Page) =>
  page.getByLabel('Include document title');

const getExportEditable = (page: Page) => getEditable(page.locator('pre'));
// const getExportEditorHandle = (page: Page) => getEditorHandle(page, getExportEditable(page));

const getUndoButton = (page: Page) =>
  page.getByRole('button', { name: 'Undo changes' });

test.describe('Export HTML', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page, 'My document');

    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('Hello World!');

    await openExportHTMLSection(page);
    await page.waitForTimeout(2000);
  });

  test('shows the HTML for the document', async ({ page }) => {
    const editable = getExportEditable(page);
    await expect(editable).toContainText('<p>Hello World!</p>');
  });

  // Too flaky
  // test('undo changes', async ({ page }) => {
  //   const undoButton = getUndoButton(page);
  //   await expect(undoButton).not.toBeVisible();

  //   const editable = getExportEditable(page);
  //   const editorHandle = await getExportEditorHandle(page);
  //   await clickAtPath(page, editorHandle, [0]);
  //   await page.keyboard.type('MODIFIED');
  //   await expect(editable).toContainText('MODIFIED');
  //   await expect(undoButton).toBeVisible();

  //   await undoButton.click();
  //   await expect(editable).not.toContainText('MODIFIED');
  //   await expect(undoButton).not.toBeVisible();
  // });

  test('includes the document title by default', async ({ page }) => {
    const checkbox = getDocumentTitleCheckbox(page);
    expect(await checkbox.isChecked()).toBe(true);

    const editable = getExportEditable(page);
    await expect(editable).toContainText('<h1>My document</h1>');
  });

  test('unticking the checkbox removes the document title', async ({
    page,
  }) => {
    const checkbox = getDocumentTitleCheckbox(page);
    await checkbox.uncheck();

    const editable = getExportEditable(page);
    await expect(editable).not.toContainText('<h1>My document</h1>');

    const undoButton = getUndoButton(page);
    await expect(undoButton).not.toBeVisible();
  });
});
