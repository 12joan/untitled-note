import { focusEditor, PlateEditor } from '@udecode/plate';
import { Selection } from 'slate';
import { normalizeRange } from '~/lib/editor/normalizeRange';

const selectionForDocument: Record<number, Selection> = {};

export const saveSelection = (documentId: number, editor: PlateEditor) => {
  selectionForDocument[documentId] = editor.selection;
};

export const setSelection = (editor: PlateEditor, selection?: Selection) => {
  // Returns null if the selection is not valid
  const normalizedSelection = selection && normalizeRange(editor, selection);

  if (normalizedSelection) {
    focusEditor(editor, normalizedSelection);
  }
};

export const restoreSelection = (documentId: number, editor: PlateEditor) =>
  setSelection(editor, selectionForDocument[documentId]);
