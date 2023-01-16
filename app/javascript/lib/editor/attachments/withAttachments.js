import {
  removeNodes,
  select,
} from '@udecode/plate-headless'
import { Editor, Range } from 'slate'

import { nodeAtPathIsEmptyParagraph } from './utils'

/* If all of the following are true:
 * - the unit is 'character' or 'word'
 * - the selection is collapsed
 * - the selection is at an empty paragraph
 * - the adjacent block is an attachment
 * Then delete the paragraph and select the attachment
 */

const withAttachments = editor => {
  const { deleteBackward, deleteForward } = editor

  const customDeleteBehaviour = (defaultDelete, deltaPath) => unit => {
    if (unit === 'character' || unit === 'word') {
      const { selection } = editor
      const path = selection?.anchor?.path?.slice(0, 1)

      if (selection && Range.isCollapsed(selection) && nodeAtPathIsEmptyParagraph(editor, path)) {
        const adjacentBlockPath = [path[0] + deltaPath]
        const adjacentBlock = Editor.node(editor, adjacentBlockPath)

        if (adjacentBlock[0].type === 'attachment') {
          removeNodes(editor, { at: path })

          // If the node we removed was above the attachment, then the
          // attachment path will have decreased by 1
          const newAdjacentBlockPath = [adjacentBlockPath[0] + (deltaPath === 1 ? -1 : 0)]
          select(editor, newAdjacentBlockPath)

          return
        }
      }
    }

    defaultDelete(unit)
  }

  editor.deleteBackward = customDeleteBehaviour(deleteBackward, -1)
  editor.deleteForward = customDeleteBehaviour(deleteForward, 1)

  return editor
}

export default withAttachments
