import { expect, test } from '@playwright/test';
import {
  createDocument,
  createProject,
  locateSidebarPinnedDocuments,
  locateSidebarRecentlyViewedDocuments,
  logIn,
} from './utils';

test.describe('Basic editor', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page, 'Context menu document');
  });

  test('pins document using context menu', async ({ page }) => {
    // Recently viewed documents should contain the document
    const recentlyViewedDocument = locateSidebarRecentlyViewedDocuments(
      page
    ).getByText('Context menu document');
    await expect(recentlyViewedDocument).toBeVisible();

    // Pin the document
    await recentlyViewedDocument.click({ button: 'right' });
    await page.getByText('Pin document').click();

    // Pinned documents should contain the document
    const pinnedDocument = locateSidebarPinnedDocuments(page).getByText(
      'Context menu document'
    );
    await expect(pinnedDocument).toBeVisible();
  });
});
