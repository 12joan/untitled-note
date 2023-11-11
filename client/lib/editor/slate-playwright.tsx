import { useEffect } from 'react';
import { getNode, PlateEditor, toDOMNode, useEditorRef } from '@udecode/plate';

const EDITABLE_TO_EDITOR = new WeakMap<HTMLElement, PlateEditor>();

export const SlatePlaywrightEffects = () => {
  const editor = useEditorRef();

  useEffect(() => {
    const editable = toDOMNode(editor, editor)!;
    EDITABLE_TO_EDITOR.set(editable, editor);

    return () => {
      EDITABLE_TO_EDITOR.delete(editable);
    };
  }, [editor]);

  return null;
};

window.playwrightUtils = {
  EDITABLE_TO_EDITOR,
  getNode,
  toDOMNode,
};
