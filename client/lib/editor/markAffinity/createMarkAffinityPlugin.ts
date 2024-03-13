import {
  createPluginFactory,
  isSelectionExpanded,
  MARK_CODE,
} from '@udecode/plate';
import { getMarkBoundary } from './getMarkBoundary';
import { getMarkBoundaryAffinity } from './getMarkBoundaryAffinity';
import { setMarkBoundaryAffinity } from './setMarkBoundaryAffinity';
import { MarkBoundary } from './types';

const markBoundaryHasMark = (markBoundary: MarkBoundary, mark: string) => {
  const [backwardLeafEntry, forwardLeafEntry] = markBoundary;
  return (
    (backwardLeafEntry && backwardLeafEntry[0][mark]) ||
    (forwardLeafEntry && forwardLeafEntry[0][mark])
  );
};

export const KEY_MARK_AFFINITY = 'mark-affinity';

export const createMarkAffinityPlugin = createPluginFactory({
  key: KEY_MARK_AFFINITY,
  withOverrides: (editor) => {
    const { deleteBackward, move } = editor;

    /**
     * On backspace, if the deletion results in the cursor being at a mark
     * boundary, then the affinity should be forward. If the deletion removes
     * a character from the left mark, then the affinity should be backward.
     */
    editor.deleteBackward = (unit) => {
      if (
        unit === 'character' &&
        editor.selection &&
        !isSelectionExpanded(editor)
      ) {
        const [leftMarkEntryBefore] = getMarkBoundary(editor) ?? [null];
        const removingFromLeftMark =
          leftMarkEntryBefore && leftMarkEntryBefore[0].text.length > 1;

        deleteBackward(unit);

        const afterMarkBoundary = getMarkBoundary(editor);

        if (afterMarkBoundary) {
          setMarkBoundaryAffinity(
            editor,
            afterMarkBoundary,
            removingFromLeftMark ? 'backward' : 'forward'
          );
        }
        return;
      }

      deleteBackward(unit);
    };

    editor.move = (options) => {
      const {
        unit = 'character',
        distance = 1,
        reverse = false,
      } = options || {};
      if (
        unit === 'character' &&
        distance === 1 &&
        editor.selection &&
        !isSelectionExpanded(editor)
      ) {
        const beforeMarkBoundary = getMarkBoundary(editor);

        /**
         * If the cursor is at the start or end of a list of text nodes and
         * inside a code mark, then moving outside the mark should set the
         * affinity accordingly.
         */
        if (
          beforeMarkBoundary &&
          markBoundaryHasMark(beforeMarkBoundary, MARK_CODE) &&
          beforeMarkBoundary[reverse ? 0 : 1] === null &&
          getMarkBoundaryAffinity(editor, beforeMarkBoundary) ===
            (reverse ? 'forward' : 'backward')
        ) {
          setMarkBoundaryAffinity(
            editor,
            beforeMarkBoundary,
            reverse ? 'backward' : 'forward'
          );
          return;
        }

        move(options);

        const afterMarkBoundary = getMarkBoundary(editor);

        /**
         * If the move places the cursor at a mark boundary, then the affinity
         * should be set to the direction the cursor came from.
         */
        if (afterMarkBoundary) {
          setMarkBoundaryAffinity(
            editor,
            afterMarkBoundary,
            reverse ? 'forward' : 'backward'
          );
        }
        return;
      }

      move(options);
    };

    return editor;
  },
});
