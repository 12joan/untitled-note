import { createPluginFactory } from '@udecode/plate';
import { setGlobalStore } from '~/lib/globalStore';
import { DragCursor } from './components/DragCursor';
import { ELEMENT_ATTACHMENT } from './constants';
import { findDragPath } from './findDragPath';
import { insertAttachments } from './insertAttachments';
import { AttachmentPlugin } from './types';
import { withAttachments } from './withAttachments';

const setDragCursorPosition = (position: number | null) =>
  setGlobalStore('dragCursorPosition', position);

const getItemIsFile = (item: DataTransferItem): boolean => {
  if (window.attachmentSkipFolderCheck) {
    return true;
  }

  if ('getAsEntry' in item) {
    return (item as any).getAsEntry()?.isFile;
  }

  if ('webkitGetAsEntry' in item) {
    return (item as any).webkitGetAsEntry()?.isFile;
  }

  return false;
};

const createAttachmentPlugin = createPluginFactory<AttachmentPlugin>({
  key: ELEMENT_ATTACHMENT,
  isElement: true,
  isVoid: true,
  renderAfterEditable: DragCursor,
  withOverrides: withAttachments,
  handlers: {
    onDragOver: (editor) => (event) => {
      if (event.dataTransfer.types.includes('Files')) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        const path = findDragPath(editor, event);
        setDragCursorPosition(path[0]);
      }
    },

    onDragLeave: () => () => {
      setDragCursorPosition(null);
    },

    onDrop: (editor) => (event) => {
      event.preventDefault();
      setDragCursorPosition(null);

      // Extract non-directory files from the dropped items
      const files = Array.from(event.dataTransfer.items)
        .filter(getItemIsFile)
        .map((item) => item.getAsFile()!);

      if (files.length > 0) {
        const path = findDragPath(editor, event);
        insertAttachments(editor, path[0], files);
      }
    },

    onPaste: (editor) => (event) => {
      if (editor.selection === null) {
        return;
      }

      // Probably not possible to paste a directory, so no need to check for that
      const files = Array.from(event.clipboardData.files);

      if (files.length > 0) {
        // The default paste handler sometimes causes an error as a result of
        // insertAttachments removing an empty paragraph at the end of the
        // document
        event.preventDefault();

        // Insert before the current block if the cursor is at the start of
        // the block, otherwise insert after the current block
        const blockIndex =
          editor.selection.anchor.path[0] +
          (editor.selection.anchor.offset === 0 ? 0 : 1);

        insertAttachments(editor, blockIndex, files);
      }
    },
  },
});

export { createAttachmentPlugin };
