import {
  removeNodes,
  select,
} from '@udecode/plate-headless'
import { Editor, Range } from 'slate'

import { nodeAtPathIsEmptyParagraph } from './utils'

const withAttachments = editor => {
  const { deleteBackward } = editor

  // If all of the following are true:
  // - the unit is 'character' or 'word'
  // - the selection is collapsed
  // - the selection is at an empty paragraph
  // - the previous block is an attachment
  // Then delete the paragraph and select the attachment
  editor.deleteBackward = unit => {
    if (unit === 'character' || unit === 'word') {
      const { selection } = editor
      const path = selection?.anchor?.path?.slice(0, 1)

      if (selection && Range.isCollapsed(selection) && nodeAtPathIsEmptyParagraph(editor, path)) {
        const previousBlockPath = [path[0] - 1]
        const previousBlock = Editor.node(editor, previousBlockPath)

        if (previousBlock[0].type === 'attachment') {
          removeNodes(editor, { at: path })
          select(editor, previousBlockPath)
          return
        }
      }
    }

    deleteBackward(unit)
  }

  return editor
}

export default withAttachments
