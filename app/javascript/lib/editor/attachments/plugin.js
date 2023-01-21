import {
  createPluginFactory,
} from '@udecode/plate-headless'

import { setGlobalStore } from '~/lib/globalStores'
import { ELEMENT_ATTACHMENT } from './constants'
import uploadsInProgressStore from './uploadsInProgressStore'
import { attachmentNodeExists } from './utils'
import findDragPath from './findDragPath'
import insertAttachments from './insertAttachments'
import withAttachments from './withAttachments'

import DragCursor from './components/DragCursor'

const setDragCursorPosition = position => setGlobalStore('dragCursorPosition', position)

const createAttachmentPlugin = createPluginFactory({
  key: ELEMENT_ATTACHMENT,
  isElement: true,
  isVoid: true,
  renderAfterEditable: DragCursor,
  withOverrides: withAttachments,
  handlers: {
    onChange: editor => event => {
      uploadsInProgressStore.forEach(([s3FileId, { abortController }]) => {
        if (!attachmentNodeExists(editor, s3FileId)) {
          abortController.abort()
        }
      })
    },

    onDragOver: editor => event => {
      if (event.dataTransfer.types.includes('Files')) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'

        const path = findDragPath(editor, event)
        setDragCursorPosition(path[0])
      }
    },

    onDragLeave: editor => event => {
      setDragCursorPosition(null)
    },

    onDrop: editor => event => {
      event.preventDefault()
      setDragCursorPosition(null)

      // Extract non-directory files from the dropped items
      const files = Array.from(event.dataTransfer.items)
        .filter(item => (item.getAsEntry || item.webkitGetAsEntry).call(item)?.isFile)
        .map(item => item.getAsFile())

      if (files.length > 0) {
        const path = findDragPath(editor, event)
        insertAttachments(editor, path[0], files)
      }
    },

    onPaste: editor => event => {
      // Probably not possible to paste a directory, so no need to check for that
      const files = Array.from(event.clipboardData.files)

      if (files.length > 0) {
        // Insert before the current block if the cursor is at the start of
        // the block, otherwise insert after the current block
        const blockIndex = editor.selection.anchor.path[0] + (
          editor.selection.anchor.offset === 0 ? 0 : 1
        )

        insertAttachments(editor, blockIndex, files)
      }
    },
  },
})

export { createAttachmentPlugin }