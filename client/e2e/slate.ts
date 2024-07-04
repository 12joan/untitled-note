import { ElementHandle, JSHandle, Locator, Page } from '@playwright/test';
import { Path, Range } from 'slate';
import { PlateEditor, TNode } from '~/lib/editor/plate';

import '../lib/globals.d';

export type EditorHandle = JSHandle<PlateEditor>;

export const getEditable = (context: Page | Locator) =>
  context.locator('[data-slate-editor]');

export const getEditorHandle = async (
  page: Page,
  editable?: Locator
): Promise<EditorHandle> => {
  const editableHandle = await (editable || getEditable(page)).elementHandle();

  return page.evaluateHandle((editable) => {
    const editor = window.playwrightUtils.EDITABLE_TO_EDITOR.get(
      editable as any
    );
    if (!editor) throw new Error('Editor not found');
    return editor;
  }, editableHandle);
};

export const getSlateNodeByPath = async (
  page: Page,
  editorHandle: EditorHandle,
  path: Path
): Promise<JSHandle<TNode>> =>
  page.evaluateHandle(
    ([editor, path]) => {
      const node = window.playwrightUtils.getNode(editor, path);
      if (!node) throw new Error(`Node not found at path ${path}`);
      return node;
    },
    [editorHandle, path] as const
  );

export const getDOMNodeByPath = async (
  page: Page,
  editorHandle: EditorHandle,
  path: Path
): Promise<ElementHandle> => {
  const nodeHandle = await getSlateNodeByPath(page, editorHandle, path);

  return page.evaluateHandle(
    ([editor, node]) => {
      const domNode = window.playwrightUtils.toDOMNode(editor, node);
      if (!domNode) throw new Error(`DOM node not found at path ${path}`);
      return domNode;
    },
    [editorHandle, nodeHandle] as const
  );
};

export const clickAtPath = async (
  page: Page,
  editorHandle: EditorHandle,
  path: Path
) => {
  const domNode = await getDOMNodeByPath(page, editorHandle, path);
  await domNode.click();
};

export const getTypeAtPath = async (
  page: Page,
  editorHandle: EditorHandle,
  path: Path
): Promise<string> => {
  const nodeHandle = await getSlateNodeByPath(page, editorHandle, path);
  const node = await nodeHandle.jsonValue();
  if ('text' in node) return 'text';
  return node.type as string;
};

export const getSelection = async (
  page: Page,
  editorHandle: EditorHandle
): Promise<Range | null> =>
  page.evaluate((editor) => editor.selection, editorHandle);

export const setSelection = async (
  page: Page,
  editorHandle: EditorHandle,
  range: Range
) =>
  page.evaluate(([editor, range]) => editor.setSelection(range), [
    editorHandle,
    range,
  ] as const);

export const addMark = async (
  page: Page,
  editorHandle: EditorHandle,
  key: string,
  value: any
) =>
  page.evaluate(
    ([editor, key, value]) =>
      window.playwrightUtils.addMark(editor, key, value),
    [editorHandle, key, value] as const
  );
