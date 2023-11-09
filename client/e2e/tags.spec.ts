import { expect, test } from '@playwright/test';
import { createDocument, createProject, logIn } from './utils';

test.describe('Tags', () => {
  test('add and remove tags', async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page, 'Document 1');

    const sidebar = page.getByLabel('Sidebar');
    const main = page.getByRole('main');

    // Add 'First tag' to Document 1
    await page.getByLabel('Add tags').click();
    await page.keyboard.type('First tag');
    await page.keyboard.press('Enter');

    // 'First tag' should contain Document 1
    await expect(sidebar).toContainText('First tag');
    await main.getByRole('link', { name: 'First tag' }).click();
    await expect(main).toContainText('Tag: First tag');
    await expect(main).toContainText('Document 1');

    await page.goBack();

    // Add and remove 'Second tag' to Document 1
    await page.getByLabel('Add tag').click();
    await page.keyboard.type('Second tag');
    await page.keyboard.press('Enter');
    await expect(sidebar).toContainText('Second tag');
    await page.keyboard.press('Backspace');
    await expect(sidebar).not.toContainText('Second tag');

    await createDocument(page, 'Document 2');

    // Add 'First tag' to Document 2
    await page.getByLabel('Add tags').click();
    await page.keyboard.type('Firs');
    await page.keyboard.press('Enter');

    // 'First tag' should contain Document 1 and Document 2
    await main.getByRole('link', { name: 'First tag' }).click();
    await expect(main).toContainText('Tag: First tag');
    await expect(main).toContainText('Document 1');
    await expect(main).toContainText('Document 2');

    await page.goBack();

    // Remove 'First tag' from Document 2
    await page.getByLabel('Remove tag').click();

    // 'First tag' should contain only Document 1
    await sidebar.getByRole('link', { name: 'First tag' }).click();
    await expect(main).toContainText('Tag: First tag');
    await expect(main).toContainText('Document 1');
    await expect(main).not.toContainText('Document 2');
  });
});
