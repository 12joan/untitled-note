import { expect, Page } from '@playwright/test';
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

export const fillDocumentTitle = async (page: Page, title: string) => {
  await page.getByLabel('Document title').fill(title);
};

export const createDocument = async (page: Page, title?: string) => {
  await page.getByLabel('New Document').click();

  if (title) {
    await fillDocumentTitle(page, title);
  }

  const editable = await getEditable(page);
  await expect(editable).toHaveText('Write something...');
};

export const expectSyncState = async (page: Page, state: string) => {
  await page.getByLabel('Document menu').click();
  await expect(page.getByText(state)).toBeVisible();
  await page.keyboard.press('Escape');
};

export const expectUnsavedChanges = async (page: Page) =>
  expectSyncState(page, 'Unsaved changes');
export const expectUpToDate = async (page: Page) =>
  expectSyncState(page, 'Up to date');
