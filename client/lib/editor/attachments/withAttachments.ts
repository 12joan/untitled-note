import {
  ELEMENT_LI,
  getBlockAbove,
  getNode,
  insertBreakList,
  isCollapsed,
  isSelectionAtBlockEnd,
  isSelectionAtBlockStart,
  moveSelection,
  PlateEditor,
  removeNodes,
  select,
  unwrapList,
  withoutNormalizing,
} from '@udecode/plate';
import { ELEMENT_ATTACHMENT } from './constants';
import { AttachmentElement } from './types';
import { abortUpload, getUploadIsInProgress } from './uploadsInProgressStore';
import { nodeAtPathIsEmptyParagraph } from './utils';

export const withAttachments = (editor: PlateEditor) => {
  const { deleteBackward, deleteForward, insertFragment, apply } = editor;

  type DeleteFn = typeof deleteBackward | typeof deleteForward;

  const customDeleteBehaviour =
    (defaultDelete: DeleteFn, deltaPath: number): DeleteFn =>
    (unit) => {
      /**
       * If all of the following are true, then delete the paragraph and select
       * the attachment:
       * - the unit is 'character' or 'word'
       * - the selection is collapsed
       * - the selection is at an empty paragraph
       * - the adjacent block is an attachment
       */

      if (unit === 'character' || unit === 'word') {
        const { selection } = editor;
        const path = selection?.anchor?.path?.slice(0, 1);

        if (
          path &&
          isCollapsed(selection) &&
          nodeAtPathIsEmptyParagraph(editor, path)
        ) {
          const adjacentBlockPath = [path[0] + deltaPath];
          const adjacentBlock = getNode(editor, adjacentBlockPath);

          if (adjacentBlock?.type === ELEMENT_ATTACHMENT) {
            removeNodes(editor, { at: path });

            // If the node we removed was above the attachment, then the
            // attachment path will have decreased by 1
            const newAdjacentBlockPath = [
              adjacentBlockPath[0] + (deltaPath === 1 ? -1 : 0),
            ];

            select(editor, newAdjacentBlockPath);

            return;
          }
        }
      }

      defaultDelete(unit);
    };

  editor.deleteBackward = customDeleteBehaviour(deleteBackward, -1);
  editor.deleteForward = customDeleteBehaviour(deleteForward, 1);

  // Handle inserting attachments into lists
  editor.insertFragment = (fragment) => {
    withoutNormalizing(editor, () => {
      const fragmentHasAttachment = fragment.some(
        (node) => node.type === ELEMENT_ATTACHMENT
      );
      const isInList = !!getBlockAbove(editor, { match: { type: ELEMENT_LI } });

      if (fragmentHasAttachment && isInList) {
        // If the selection is not at the start, insert a break
        if (!isSelectionAtBlockStart(editor)) {
          insertBreakList(editor);
        }

        /**
         * If the selection is not at the end, insert a break and move the
         * selection up to the empty LIC
         */
        if (!isSelectionAtBlockEnd(editor)) {
          insertBreakList(editor);
          moveSelection(editor, { reverse: true });
        }

        unwrapList(editor);
      }

      insertFragment(fragment);
    });
  };

  // Abort upload if attachment is removed during upload
  editor.apply = (operation) => {
    if (
      operation.type === 'remove_node' &&
      operation.node.type === ELEMENT_ATTACHMENT
    ) {
      const { s3FileId } = operation.node as AttachmentElement;

      if (getUploadIsInProgress(s3FileId)) {
        abortUpload(s3FileId);
      }
    }

    apply(operation);
  };

  return editor;
};
