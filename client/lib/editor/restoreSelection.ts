import { focusEditor, PlateEditor } from '@udecode/plate';
import { Selection } from 'slate';
import { normalizeRange } from '~/lib/editor/normalizeRange';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';

const selectionForDocument: Record<number, Selection> = {};

export const useSaveSelection = (documentId: number, editor: PlateEditor) =>
  useEffectAfterFirst(() => {
    selectionForDocument[documentId] = editor.selection;
  }, [editor.selection]);

export const setSelection = (editor: PlateEditor, selection?: Selection) => {
  // Returns null if the selection is not valid
  const normalizedSelection = selection && normalizeRange(editor, selection);

  if (normalizedSelection) {
    focusEditor(editor, normalizedSelection);
  }
};

export const restoreSelection = (documentId: number, editor: PlateEditor) =>
  setSelection(editor, selectionForDocument[documentId]);
