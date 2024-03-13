import { expect, Page, test } from '@playwright/test';
import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import {
  clickAtPath,
  EditorHandle,
  getEditorHandle,
  getSlateNodeByPath,
  setSelection,
} from './slate';
import {
  clickFormattingToolbarButton,
  createDocument,
  createProject,
  logIn,
} from './utils';

test.describe('Marks', () => {
  const getParagraph = async (page: Page, editorHandle: EditorHandle) => {
    const paragraphHandle = await getSlateNodeByPath(page, editorHandle, [0]);

    return paragraphHandle.jsonValue();
  };

  test.beforeEach(async ({ page }) => {
    await logIn(page);
    await createProject(page);
    await createDocument(page);
  });

  const setUpOneTwoThreeFour = async (page: Page) => {
    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('onetwothreefour');
    await page.keyboard.press('Enter');

    // Make 'two' inline code
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 0], offset: 3 },
      focus: { path: [0, 0], offset: 6 },
    });

    await clickFormattingToolbarButton(page, 'Inline code');

    // Make 'four' inline code and bold
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 2], offset: 5 },
      focus: { path: [0, 2], offset: 9 },
    });

    await clickFormattingToolbarButton(page, 'Inline code');
    await clickFormattingToolbarButton(page, 'Bold');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'two', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });
  };

  const setUpTwo = async (page: Page) => {
    const editorHandle = await getEditorHandle(page);
    await clickAtPath(page, editorHandle, [0]);
    await page.keyboard.type('two');
    await page.keyboard.press('Enter');

    // Make 'two' inline code
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 3 },
    });

    await clickFormattingToolbarButton(page, 'Inline code');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [{ text: 'two', code: true }],
    });
  };

  test('backspace does not enter code prematurely', async ({ page }) => {
    await setUpOneTwoThreeFour(page);
    const editorHandle = await getEditorHandle(page);

    // Place the cursor after the 't' in 'three'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 2], offset: 1 },
      focus: { path: [0, 2], offset: 1 },
    });

    await page.keyboard.press('Backspace');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'two', code: true },
        { text: 'hree' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.type('t');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'two', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('a');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'twa', code: true },
        { text: 'hree' },
        { text: 'four', code: true, bold: true },
      ],
    });

    // Place the cursor after the first 'e' in 'hree'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 2], offset: 3 },
      focus: { path: [0, 2], offset: 3 },
    });

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('b');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'twa', code: true },
        { text: 'bfour', code: true, bold: true },
      ],
    });

    // Place the cursor at the end of 'bfour'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 2], offset: 5 },
      focus: { path: [0, 2], offset: 5 },
    });

    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('c');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [{ text: 'one' }, { text: 'twa', code: true }, { text: 'c' }],
    });
  });

  test('backspace does not leave code prematurely', async ({ page }) => {
    await setUpOneTwoThreeFour(page);
    const editorHandle = await getEditorHandle(page);

    // Place the cursor after the 't' in 'two'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 1], offset: 1 },
      focus: { path: [0, 1], offset: 1 },
    });

    await page.keyboard.press('Backspace');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'wo', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.type('t');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'two', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('a');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'ona' },
        { text: 'wo', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });
  });

  test('arrow keys on right edge of inline code', async ({ page }) => {
    await setUpOneTwoThreeFour(page);
    const editorHandle = await getEditorHandle(page);

    // Place the cursor after the 'w' in 'two'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 1], offset: 2 },
      focus: { path: [0, 1], offset: 2 },
    });

    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('a');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'twoa', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('b');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'twoa', code: true },
        { text: 'bthree' },
        { text: 'four', code: true, bold: true },
      ],
    });
  });

  test('arrow keys on left edge of inline code', async ({ page }) => {
    await setUpOneTwoThreeFour(page);
    const editorHandle = await getEditorHandle(page);

    // Place the cursor after the 't' in 'two'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 1], offset: 1 },
      focus: { path: [0, 1], offset: 1 },
    });

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('a');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'one' },
        { text: 'atwo', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('b');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'oneb' },
        { text: 'atwo', code: true },
        { text: 'three' },
        { text: 'four', code: true, bold: true },
      ],
    });
  });

  test('code at start or end of paragraph', async ({ page }) => {
    await setUpTwo(page);
    const editorHandle = await getEditorHandle(page);

    // Place the cursor after the 't' in 'two'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    });

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('a');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [{ text: 'a' }, { text: 'two', code: true }],
    });

    // Place the cursor after the 'w' in 'two'
    await setSelection(page, editorHandle, {
      anchor: { path: [0, 1], offset: 2 },
      focus: { path: [0, 1], offset: 2 },
    });

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('b');

    expect(await getParagraph(page, editorHandle)).toEqual({
      type: ELEMENT_PARAGRAPH,
      children: [{ text: 'a' }, { text: 'two', code: true }, { text: 'b' }],
    });
  });
});
