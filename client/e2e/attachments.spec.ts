import { expect, test } from '@playwright/test';
import { Path } from 'slate';
import {
  clickAtPath,
  getDOMNodeByPath,
  getEditorHandle,
  getSelection,
  getTypeAtPath,
} from './slate';
import {
  createDataTransfer,
  createDocument,
  createProject,
  dragAndDropFile,
  logIn,
  openFileStorageModal,
} from './utils';

test.describe('Attachments', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);

    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);

    await page.keyboard.type('Paragraph 1');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Paragraph 2');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Paragraph 3');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Paragraph 4');
  });

  test('drag non-image into editor', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Insert an attachment between paragraphs 2 and 3
    const paragraphHandle = await getDOMNodeByPath(page, editorHandle, [2]);

    const dataTransfer = await createDataTransfer(page, {
      filePath: './test-files/plain-text.txt',
      fileName: 'plain-text.txt',
      fileType: 'text/plain',
    });

    await dragAndDropFile(paragraphHandle, dataTransfer, 'above');

    await expect(page.getByTestId('uploaded-attachment')).toContainText(
      'plain-text.txt'
    );

    expect(await getTypeAtPath(page, editorHandle, [2])).toEqual('attachment');
  });

  test('drag image into editor', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Insert an attachment between paragraphs 2 and 3
    const paragraphHandle = await getDOMNodeByPath(page, editorHandle, [2]);

    const dataTransfer = await createDataTransfer(page, {
      filePath: './test-files/image.png',
      fileName: 'image.png',
      fileType: 'image/png',
    });

    await dragAndDropFile(paragraphHandle, dataTransfer, 'above');

    await expect(
      page.getByTestId('uploaded-attachment').getByRole('img')
    ).toBeVisible();

    expect(await getTypeAtPath(page, editorHandle, [2])).toEqual('attachment');
  });

  test('remove node during upload', async ({ page }) => {
    await page.evaluate(() => {
      window.fileUploadInfinite = true;
    });

    const editorHandle = await getEditorHandle(page);

    // Insert an attachment between paragraphs 2 and 3
    const paragraphHandle = await getDOMNodeByPath(page, editorHandle, [2]);

    const dataTransfer = await createDataTransfer(page, {
      filePath: './test-files/plain-text.txt',
      fileName: 'plain-text.txt',
      fileType: 'text/plain',
    });

    await dragAndDropFile(paragraphHandle, dataTransfer, 'above');
    await expect(page.getByTestId('uploading-attachment')).toBeVisible();

    await openFileStorageModal(page);
    await expect(page.getByText('Files (1)')).toBeVisible();
    await page.keyboard.press('Escape');

    await clickAtPath(page, editorHandle, [2]);
    await page.keyboard.press('Backspace');

    expect(await getTypeAtPath(page, editorHandle, [2])).toEqual('p');

    await openFileStorageModal(page);
    await expect(page.getByText('Files (0)')).toBeVisible();
  });

  test('tab into attachment', async ({ page }) => {
    const editorHandle = await getEditorHandle(page);

    // Insert an attachment between paragraphs 2 and 3
    const paragraphHandle = await getDOMNodeByPath(page, editorHandle, [2]);

    const dataTransfer = await createDataTransfer(page, {
      filePath: './test-files/plain-text.txt',
      fileName: 'plain-text.txt',
      fileType: 'text/plain',
    });

    await dragAndDropFile(paragraphHandle, dataTransfer, 'above');

    await expect(page.getByTestId('uploaded-attachment')).toContainText(
      'plain-text.txt'
    );

    const expectTabbedIntoAttachment = async () => {
      const activeElementTestId = await page.evaluate(() => {
        return document.activeElement?.getAttribute('data-testid');
      });

      expect(activeElementTestId).toEqual('download-attachment');
    };

    const expectSelectionPath = async (path: Path) => {
      const selection = await getSelection(page, editorHandle);
      expect(selection?.anchor.path).toEqual(path);
      expect(selection?.focus.path).toEqual(path);
    };

    await clickAtPath(page, editorHandle, [1]);
    await page.keyboard.press('Tab');
    await expectTabbedIntoAttachment();

    await page.keyboard.press('Tab');
    await expectSelectionPath([3, 0]);

    // Fix flakiness
    await page.waitForTimeout(100);

    await page.keyboard.press('Shift+Tab');
    await expectTabbedIntoAttachment();

    await page.keyboard.press('Shift+Tab');
    await expectSelectionPath([2, 0]);
  });
});
