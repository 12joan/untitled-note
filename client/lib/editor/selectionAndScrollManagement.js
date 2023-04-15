import { useEffect } from 'react';
import { focusEditor } from '@udecode/plate-headless';
import normalizeRange from '~/lib/editor/normalizeRange';
import useEffectAfterFirst from '~/lib/useEffectAfterFirst';

const selectionRestorationForDocument = {};
const scrollRestorationForDocument = {};

const useSaveSelection = (documentId, editor) =>
  useEffectAfterFirst(() => {
    selectionRestorationForDocument[documentId] = editor.selection;
  }, [editor.selection]);

const useSaveScroll = (documentId) =>
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

const setSelection = (editor, selection) => {
  // Returns null if the selection is not valid
  const normalizedSelection = selection && normalizeRange(editor, selection);

  if (normalizedSelection) {
    focusEditor(editor, normalizedSelection);
  }
};

const setScroll = (scroll) => {
  if (scroll) {
    window.scrollTo(0, scroll);
  }
};

const restoreSelection = (documentId, editor) =>
  setSelection(editor, selectionRestorationForDocument[documentId]);
const restoreScroll = (documentId) =>
  setScroll(scrollRestorationForDocument[documentId]);

export {
  useSaveSelection,
  useSaveScroll,
  setSelection,
  setScroll,
  restoreSelection,
  restoreScroll,
};
