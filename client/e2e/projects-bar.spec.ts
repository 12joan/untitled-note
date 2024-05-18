import { expect, Page, test } from '@playwright/test';
import {
  createProject,
  createProjectFolder,
  createProjectInFolder,
  DragFn,
  dragWithKeyboard,
  dragWithMouse,
  expectCurrentProject,
  locateEmptyProjectsBarDropLine,
  locateProject,
  locateProjectDropLine,
  locateProjectFolder,
  locateProjectFolderDropLine,
  locateProjectsBar,
  logIn,
} from './utils';

const dragTypes: [DragFn, string][] = [
  [dragWithMouse, 'mouse'],
  [dragWithKeyboard, 'keyboard'],
];

const dragProjectToProject = (
  drag: DragFn,
  page: Page,
  projectName: string,
  destinationProjectName: string,
  side: 'before' | 'after'
) =>
  drag(
    page,
    locateProject(page, projectName),
    locateProjectDropLine(page, destinationProjectName, side)
  );

const dragProjectToFolder = (
  drag: DragFn,
  page: Page,
  projectName: string,
  folderName: string
) =>
  drag(
    page,
    locateProject(page, projectName),
    locateProjectFolder(page, folderName)
  );

const dragProjectToProjectInFolder = (
  drag: DragFn,
  page: Page,
  projectName: string,
  folderName: string,
  destinationProjectName: string,
  side: 'before' | 'after'
) =>
  drag(
    page,
    locateProject(page, projectName),
    locateProjectFolder(page, folderName),
    locateProjectDropLine(page, destinationProjectName, side)
  );

const dragFolderToFolder = (
  drag: DragFn,
  page: Page,
  folderName: string,
  destinationFolderName: string,
  side: 'before' | 'after'
) =>
  drag(
    page,
    locateProjectFolder(page, folderName),
    locateProjectFolderDropLine(page, destinationFolderName, side)
  );

const expectProjectIndex = async (
  page: Page,
  projectName: string,
  index: number
) =>
  expect(
    await locateProject(page, projectName).getAttribute('data-test-list-index')
  ).toBe(index.toString());

const expectFolderIndex = async (
  page: Page,
  folderName: string,
  index: number
) =>
  expect(
    await locateProjectFolder(page, folderName).getAttribute(
      'data-test-list-index'
    )
  ).toBe(index.toString());

test.describe('Projects bar', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page, '1st Project');
    await createProject(page, '2nd Project');
    await createProject(page, '3rd Project');
    await createProjectFolder(page, 'A Folder');
    await createProjectInFolder(page, 'A Folder', '4th Project');
    await createProjectInFolder(page, 'A Folder', '5th Project');
    await createProjectFolder(page, 'B Folder');
    await createProjectInFolder(page, 'B Folder', '6th Project');
    await createProjectInFolder(page, 'B Folder', '7th Project');
    await createProjectFolder(page, 'C Folder');
    await createProjectInFolder(page, 'C Folder', '8th Project');
    await createProjectInFolder(page, 'C Folder', '9th Project');
  });

  test.describe('Switching projects', () => {
    test.describe('Using the mouse', () => {
      test('switch to projects outside folders', async ({ page }) => {
        await locateProject(page, '2nd Project').click();
        await expectCurrentProject(page, '2nd Project');
      });

      test('switch to projects inside folders', async ({ page }) => {
        await locateProjectFolder(page, 'B Folder').hover();
        await locateProject(page, '6th Project').click();
        await expectCurrentProject(page, '6th Project');
      });
    });

    test.describe('Using the keyboard', () => {
      test.beforeEach(async ({ page }) => {
        await locateProjectsBar(page).focus();
      });

      test('switch to projects outside folders', async ({ page }) => {
        await page.keyboard.press('Tab'); // 1st
        await page.keyboard.press('Tab'); // 2nd
        await page.keyboard.press('Enter');
        await expectCurrentProject(page, '2nd Project');
      });

      test('switch to projects inside folders', async ({ page }) => {
        await page.keyboard.press('Tab'); // 1st
        await page.keyboard.press('Tab'); // 2nd
        await page.keyboard.press('Tab'); // 3rd
        await page.keyboard.press('Tab'); // A Folder
        await page.keyboard.press('Tab'); // B Folder
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab'); // 6th
        await page.keyboard.press('Tab'); // 7th
        await page.keyboard.press('Enter');
        await expectCurrentProject(page, '7th Project');
      });
    });
  });

  test.describe('Reordering projects and folders', () => {
    dragTypes.forEach(([drag, dragType]) => {
      test.describe(`Using the ${dragType}`, () => {
        test('reorder unfoldered projects', async ({ page }) => {
          // 1st, 2nd, 3rd -> 2nd, 3rd, 1st -> 3rd, 2nd, 1st
          await dragProjectToProject(
            drag,
            page,
            '1st Project',
            '3rd Project',
            'after'
          );
          await dragProjectToProject(
            drag,
            page,
            '3rd Project',
            '2nd Project',
            'before'
          );

          await page.waitForTimeout(200);

          await expectProjectIndex(page, '3rd Project', 0);
          await expectProjectIndex(page, '2nd Project', 1);
          await expectProjectIndex(page, '1st Project', 2);
        });

        test('drag project to folder', async ({ page }) => {
          await dragProjectToFolder(drag, page, '1st Project', 'A Folder');
          await locateProjectFolder(page, 'A Folder').hover();
          await page.waitForTimeout(200);
          await expectProjectIndex(page, '1st Project', 2);
        });

        test('drag project into folder', async ({ page }) => {
          await dragProjectToProjectInFolder(
            drag,
            page,
            '1st Project',
            'A Folder',
            '4th Project',
            'after'
          );

          await locateProjectFolder(page, 'A Folder').hover();

          await page.waitForTimeout(200);

          await expectProjectIndex(page, '4th Project', 0);
          await expectProjectIndex(page, '1st Project', 1);
          await expectProjectIndex(page, '5th Project', 2);
        });

        test('drag project out of folder when no unfoldered projects', async ({
          page,
        }) => {
          for (const name of ['1st Project', '2nd Project', '3rd Project']) {
            await dragProjectToFolder(drag, page, name, 'C Folder');
          }

          await locateProjectFolder(page, 'B Folder').hover();

          await drag(
            page,
            locateProject(page, '7th Project'),
            locateEmptyProjectsBarDropLine(page)
          );

          await page.waitForTimeout(200);

          await expectProjectIndex(page, '7th Project', 0);
        });

        test('reorder folders', async ({ page }) => {
          // A, B, C -> B, A, C -> C, B, A
          await dragFolderToFolder(drag, page, 'A Folder', 'B Folder', 'after');
          await dragFolderToFolder(
            drag,
            page,
            'C Folder',
            'B Folder',
            'before'
          );

          await page.waitForTimeout(200);

          await expectFolderIndex(page, 'C Folder', 0);
          await expectFolderIndex(page, 'B Folder', 1);
          await expectFolderIndex(page, 'A Folder', 2);
        });
      });
    });
  });
});
