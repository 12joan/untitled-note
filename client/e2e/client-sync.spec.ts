import { expect, test } from '@playwright/test';
import { clickAtPath, getEditorHandle } from './slate';
import { createDocument, createProject, logIn } from './utils';

test.describe('Client sync', () => {
  test('should sync changes between clients', async ({
    context,
    page: pageOne,
  }) => {
    await logIn(pageOne);
    await createProject(pageOne);
    await createDocument(pageOne, 'My Document');

    const pageTwo = await context.newPage();
    await pageTwo.goto(pageOne.url());
    await expect(pageTwo.getByLabel('Document title')).toHaveValue(
      'My Document'
    );

    {
      const editorHandle = await getEditorHandle(pageOne);
      await clickAtPath(pageOne, editorHandle, [0]);
      await pageOne.keyboard.type('Hello from page one');
      await pageOne.keyboard.press('Enter');
    }

    await expect(pageTwo.getByText('Hello from page one')).toBeVisible();

    {
      const editorHandle = await getEditorHandle(pageTwo);
      await clickAtPath(pageTwo, editorHandle, [1]);
      await pageTwo.keyboard.type('Hello from page two');
      await pageTwo.keyboard.press('Enter');
    }

    await expect(pageOne.getByText('Hello from page two')).toBeVisible();

    /**
     * Low-priority bug: When clients update at the same time, they swap
     * values and fail to reach a consensus.
     */
    // await Promise.all([
    //   (async () => {
    //     const editorHandle = await getEditorHandle(pageOne);
    //     await clickAtPath(pageOne, editorHandle, [2]);
    //     await pageOne.keyboard.type('Winner: page one');
    //   })(),
    //   (async () => {
    //     const editorHandle = await getEditorHandle(pageTwo);
    //     await clickAtPath(pageTwo, editorHandle, [2]);
    //     await pageTwo.keyboard.type('Winner: page two');
    //   })(),
    // ]);

    // await pageOne.waitForTimeout(4000);

    // const [pageOneValue, pageTwoValue] = await Promise.all(
    //   [pageOne, pageTwo].map(async (page) => {
    //     const editorHandle = await getEditorHandle(page);

    //     const textNode = await (
    //       await getSlateNodeByPath(page, editorHandle, [2, 0])
    //     ).jsonValue();

    //     return textNode.text;
    //   })
    // );

    // expect(pageOneValue).toEqual(pageTwoValue);
  });
});
