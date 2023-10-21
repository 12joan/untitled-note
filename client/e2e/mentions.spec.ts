import { expect, test } from '@playwright/test';
import { clickAtPath, getEditorHandle } from './slate';
import { createDocument, createProject, expectUpToDate, logIn } from './utils';

test.describe('Mentions', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
  });

  test('mention other document', async ({ page }) => {
    await createDocument(page, 'My Document');
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
