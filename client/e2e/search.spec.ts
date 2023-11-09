import { test } from '@playwright/test';
import { clickAtPath, getEditorHandle } from './slate';
import {
  createDocument,
  createProject,
  expectUpToDate,
  logIn,
  openSearchModal,
  visitOverview,
} from './utils';

test.describe('Basic editor', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page, 'My First Document');

    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type(
      'The quick brown fox jumps NEEDLE over the lazy dog'
    );
    await expectUpToDate(page);

    await visitOverview(page);
  });

  test('search for document by name', async ({ page }) => {
    await openSearchModal(page);
    await page.keyboard.type('First');
    await page.getByRole('option', { name: 'My First Document' }).click();
  });

  test('search for document by content', async ({ page }) => {
    await openSearchModal(page);
    await page.keyboard.type('NEEDLE');
    await page.getByRole('option', { name: 'My First Document' }).click();
  });
});
