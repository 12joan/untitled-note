import { useEffect } from 'react';
import { focusEditor, PlateEditor } from '@udecode/plate-headless';
import { Selection } from 'slate';
import { normalizeRange } from '~/lib/editor/normalizeRange';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';

const selectionRestorationForDocument: Record<number, Selection> = {};
const scrollRestorationForDocument: Record<number, number> = {};

export const useSaveSelection = (documentId: number, editor: PlateEditor) =>
  useEffectAfterFirst(() => {
    selectionRestorationForDocument[documentId] = editor.selection;
  }, [editor.selection]);

export const useSaveScroll = (documentId: number) =>
  useEffect(() => {
    const updateScroll = () => {
      scrollRestorationForDocument[documentId] = window.scrollY;
    };

    setTimeout(() => {
      window.addEventListener('scroll', updateScroll);
      updateScroll();
    }, 1000);

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

export const setSelection = (editor: PlateEditor, selection?: Selection) => {
  // Returns null if the selection is not valid
  const normalizedSelection = selection && normalizeRange(editor, selection);

  if (normalizedSelection) {
    focusEditor(editor, normalizedSelection);
  }
};

export const setScroll = (scroll?: number) => {
  if (scroll) {
    window.scrollTo(0, scroll);
  }
};

export const restoreSelection = (documentId: number, editor: PlateEditor) =>
  setSelection(editor, selectionRestorationForDocument[documentId]);

export const restoreScroll = (documentId: number) =>
  setScroll(scrollRestorationForDocument[documentId]);
