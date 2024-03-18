import { ElementHandle, expect, JSHandle, Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getEditable } from './slate';

export const logIn = async (page: Page) => {
  await page.goto('/');

  // Stub login
  await page.evaluate(() => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/stub_login';
    document.body.appendChild(form);
    form.submit();
  });

  // Wait for response with login cookie
  await page.waitForTimeout(200);
  await page.goto('/');
};

export const createProject = async (page: Page, name = 'My Project') => {
  await page.getByText('New Project').click();
  await page.getByLabel('Project Name').fill(name);
  await page.getByText('Create Project').click();
  await expect(page).toHaveTitle(name);
};

export const locateTopBar = (page: Page) =>
  page.getByLabel('Top bar', { exact: true });

export const locateSidebar = (page: Page) =>
  page.getByLabel('Sidebar', { exact: true });

export const locateSidebarPinnedDocuments = (page: Page) =>
  locateSidebar(page).getByTestId('sidebar-pinned-documents');

export const locateSidebarRecentlyViewedDocuments = (page: Page) =>
  locateSidebar(page).getByTestId('sidebar-recently-viewed-documents');

export const locateSidebarTags = (page: Page) =>
  locateSidebar(page).getByTestId('sidebar-tags');

export const locateFormattingToolbar = (page: Page) =>
  page.getByLabel('Formatting toolbar', { exact: true });

export const clickFormattingToolbarButton = async (page: Page, label: string) =>
  locateFormattingToolbar(page).getByLabel(label).click();

export const visitOverview = async (page: Page) => {
  await locateSidebar(page).getByText('Overview').click();
  await page.waitForURL(/\/overview$/);
};

export const fillDocumentTitle = async (page: Page, title: string) => {
  await page.getByLabel('Document title').fill(title);
};

export const createDocument = async (page: Page, title?: string) => {
  await page.getByLabel('New Document').click();

  if (title) {
    await fillDocumentTitle(page, title);
  }

  const editable = getEditable(page);
  await expect(editable).toHaveText('Write something...');
};

export const openDocumentMenu = async (page: Page) => {
  await page.getByLabel('Document menu').click();
};

export const expectSyncState = async (page: Page, state: string) => {
  await page.waitForTimeout(500);
  await openDocumentMenu(page);
  await expect(page.getByText(state)).toBeVisible();
  await page.keyboard.press('Escape');
};

export const expectUpToDate = async (page: Page) =>
  expectSyncState(page, 'Up to date');

export const openDocumentSettingsModal = async (page: Page) => {
  await openDocumentMenu(page);
  await page.getByText('Document settings').click();
};

export const openExportHTMLSection = async (page: Page) => {
  await openDocumentSettingsModal(page);
  await page.getByRole('tab', { name: 'Export HTML' }).click();
};

export type CreateDataTransfer = {
  filePath: string;
  fileName: string;
  fileType: string;
};

// https://charliedigital.com/2021/12/20/simulate-drag-and-drop-of-files-with-playwright/
export const createDataTransfer = async (
  page: Page,
  { filePath, fileName, fileType }: CreateDataTransfer
): Promise<JSHandle<DataTransfer>> => {
  const fileBuffer = readFileSync(resolve(__dirname, filePath));

  return page.evaluateHandle(
    ([data, name, type]) => {
      window.attachmentSkipFolderCheck = true;

      const dataTransfer = new DataTransfer();
      const file = new File([data.toString('hex')], name, { type });
      dataTransfer.items.add(file);

      return dataTransfer;
    },
    [fileBuffer, fileName, fileType] as const
  );
};

export const dragAndDropFile = async (
  target: ElementHandle,
  dataTransfer: JSHandle<DataTransfer>,
  direction: 'above' | 'below' = 'below'
) => {
  const boundingBox = (await target.boundingBox())!;

  const eventOptions = {
    dataTransfer,
    clientX: boundingBox.x + boundingBox.width / 2,
    clientY:
      boundingBox.y +
      boundingBox.height * (direction === 'above' ? 0.25 : 0.75),
  };

  await target.dispatchEvent('dragenter', eventOptions);
  await target.dispatchEvent('dragover', eventOptions);
  await target.dispatchEvent('drop', eventOptions);
};

export const openSearchModal = async (page: Page) => {
  await locateSidebar(page).getByText('Search').click();
};

export const openAccountModal = async (page: Page) => {
  await page.getByLabel('Account').hover();
  await page.getByText('Account info').click();
};

export const openFileStorageSection = async (page: Page) => {
  await openAccountModal(page);
  await page.getByText('File storage').click();
};

export const openSettingsModal = async (page: Page) => {
  await page.getByLabel('User preferences').click();
};
