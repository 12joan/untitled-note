import {
  ElementHandle,
  expect,
  JSHandle,
  Locator,
  Page,
} from '@playwright/test';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getEditable } from './slate';

export const logIn = async (page: Page) => {
  const tryLogIn = async (currentTry: number) => {
    await page.goto('/welcome');

    // Stub login
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/stub_login';
      document.body.appendChild(form);
      form.submit();
    });

    // Wait for response with login cookie
    await page.waitForTimeout(750 + currentTry * 1000);
    await page.goto('/');
  };

  let success = false;

  // Try multiple times to mitigate flakiness
  for (let currentTry = 0; currentTry < 8; currentTry++) {
    await tryLogIn(currentTry);

    // Wait for app to load
    await page.waitForTimeout(500 + currentTry * 1000);

    if (await page.getByText('New project').isVisible()) {
      success = true;
      break;
    }
  }

  expect(success, 'New project button should be visible').toBeTruthy();
};

export const locateTopBar = (page: Page) =>
  page.getByLabel('Top bar', { exact: true });

export const locateProjectsBar = (page: Page) =>
  page.getByLabel('Projects bar', { exact: true });

export const locateProject = (page: Page, name: string) =>
  locateProjectsBar(page).getByTestId(`project-list-item-${name}`);

export const locateProjectFolder = (page: Page, name: string) =>
  locateProjectsBar(page).getByTestId(`project-folder-${name}`);

export const locateProjectDropLine = (
  page: Page,
  name: string,
  side: 'before' | 'after'
) => locateProjectsBar(page).getByTestId(`project-drop-line-${side}-${name}`);

export const locateProjectFolderDropLine = (
  page: Page,
  name: string,
  side: 'before' | 'after'
) =>
  locateProjectsBar(page).getByTestId(
    `project-folder-drop-line-${side}-${name}`
  );

export const locateEmptyProjectsBarDropLine = (page: Page) =>
  locateProjectsBar(page).getByTestId('empty-projects-drop-line');

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

export const expectCurrentProject = (page: Page, name: string) =>
  expect(page.getByTestId('current-project')).toHaveText(name);

export const clickNewProjectOrFolder = (page: Page) =>
  locateProjectsBar(page).getByLabel('New project or folder').click();

export const createProject = async (page: Page, name = 'My Project') => {
  const noProjectsViewButton = page.getByText('New project');

  if (await noProjectsViewButton.isVisible()) {
    await noProjectsViewButton.click();
  } else {
    await clickNewProjectOrFolder(page);
    await page.getByText('New project').click();
  }

  await page.getByLabel('Project name').fill(name);
  await page.getByText('Create project').click();
  await expectCurrentProject(page, name);
};

export const createProjectFolder = async (page: Page, name = 'My Folder') => {
  await clickNewProjectOrFolder(page);
  await page.getByText('New folder').click();
  await page.getByLabel('Folder name').fill(name);
  await page.getByText('Create folder').click();
};

export const openProjectFolderActions = async (
  page: Page,
  folderName: string
) => {
  await locateProjectFolder(page, folderName).hover();

  const emptyFolderButton = page.getByText('Folder actions');

  if (await emptyFolderButton.isVisible()) {
    await emptyFolderButton.click();
  } else {
    await page.getByLabel('Folder actions').click();
  }
};

export const createProjectInFolder = async (
  page: Page,
  folderName: string,
  projectName: string
) => {
  await openProjectFolderActions(page, folderName);
  await page.getByText('New project').click();
  await page.getByLabel('Project name').fill(projectName);
  await page.getByText('Create project').click();
  await expectCurrentProject(page, projectName);
};

export type DragFn = (
  page: Page,
  item: Locator,
  ...destinations: Locator[]
) => Promise<void>;

export const dragWithMouse: DragFn = async (page, item, ...destinations) => {
  await item.hover();
  await page.mouse.down();

  for (const destination of destinations) {
    await destination.hover({ force: true });
    await destination.hover({ force: true });
  }

  await page.mouse.up();
};

export const dragWithKeyboard: DragFn = async (page, item, ...destinations) => {
  type Position = { x: number; y: number };

  const getPosition = async (locator: Locator): Promise<Position> => {
    const box = await locator.boundingBox();
    if (!box) throw new Error('Element not found');
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };

  let currentPosition = await getPosition(item);
  const dragIncrement = 25;

  const dragTo = async (position: Position) => {
    const xDirection = position.x > currentPosition.x ? 1 : -1;
    const yDirection = position.y > currentPosition.y ? 1 : -1;
    const stepsX = Math.abs(
      Math.round((position.x - currentPosition.x) / dragIncrement)
    );
    const stepsY = Math.abs(
      Math.round((position.y - currentPosition.y) / dragIncrement)
    );

    for (let i = 0; i < stepsX; i++) {
      await page.keyboard.press(xDirection === 1 ? 'ArrowRight' : 'ArrowLeft');
    }

    for (let i = 0; i < stepsY; i++) {
      await page.keyboard.press(yDirection === 1 ? 'ArrowDown' : 'ArrowUp');
    }

    const finalX = currentPosition.x + stepsX * dragIncrement * xDirection;
    const finalY = currentPosition.y + stepsY * dragIncrement * yDirection;
    currentPosition = { x: finalX, y: finalY };
  };

  await item.focus();
  await page.keyboard.press('Space');

  for (const destination of destinations) {
    const position = await getPosition(destination);
    await dragTo(position);
  }

  await page.keyboard.press('Space');
};

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

export const openDocumentAppearanceSection = async (page: Page) => {
  await openDocumentSettingsModal(page);
  await page.getByRole('tab', { name: 'Appearance' }).click();
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
  const encodedFile = fileBuffer.toString('hex');

  return page.evaluateHandle(
    ([encodedFile, name, type]) => {
      window.attachmentSkipFolderCheck = true;

      const byteCount = encodedFile.length / 2;
      const byteArray = new Uint8Array(byteCount);

      for (let i = 0; i < byteCount; i++) {
        const offset = i * 2;
        byteArray[i] = parseInt(encodedFile.slice(offset, offset + 2), 16);
      }

      const dataTransfer = new DataTransfer();
      const file = new File([byteArray], name, { type });
      dataTransfer.items.add(file);

      return dataTransfer;
    },
    [encodedFile, fileName, fileType] as const
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

export const openFileStorageModal = async (page: Page) => {
  await page.getByLabel('Account').hover();
  await page.getByText('File storage').click();
};

export const openSettingsModal = async (page: Page) => {
  await page.getByLabel('User preferences').click();
};

export const openSettingsAppearanceSection = async (page: Page) => {
  await openSettingsModal(page);
  await page.getByRole('tab', { name: 'Appearance' }).click();
};
