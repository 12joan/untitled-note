import {
  getNode,
  isCollapsed,
  PlateEditor,
  removeNodes,
  select,
} from '@udecode/plate-headless';
import { ELEMENT_ATTACHMENT } from './constants';
import { nodeAtPathIsEmptyParagraph } from './utils';

/* If all of the following are true:
 * - the unit is 'character' or 'word'
 * - the selection is collapsed
 * - the selection is at an empty paragraph
 * - the adjacent block is an attachment
 * Then delete the paragraph and select the attachment
 */

export const withAttachments = (editor: PlateEditor) => {
  const { deleteBackward, deleteForward } = editor;

  type DeleteFn = typeof deleteBackward | typeof deleteForward;

  const customDeleteBehaviour =
    (defaultDelete: DeleteFn, deltaPath: number): DeleteFn =>
    (unit) => {
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

  return editor;
};
