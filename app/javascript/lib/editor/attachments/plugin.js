import {
  createPluginFactory,
} from '@udecode/plate-headless'

import { ELEMENT_ATTACHMENT, ELEMENT_UPLOADING_ATTACHMENT } from './constants'
import store from './store'
import { uploadInProgressNodeExists } from './utils'
import findDragPath from './findDragPath'
import insertAttachments from './insertAttachments'

const setDragCursorPosition = position => {
  Array.from(document.querySelectorAll('[data-slate-editor] > *')).forEach((element, index) => {
    if (index === position) {
      element.classList.add('drag-cursor-above')
    } else {
      element.classList.remove('drag-cursor-above')
    }
  })
}

const createAttachmentPlugin = createPluginFactory({
  key: ELEMENT_ATTACHMENT,
  isElement: true,
  isVoid: true,
  plugins: [
    {
      key: ELEMENT_UPLOADING_ATTACHMENT,
      isElement: true,
      isVoid: true,
    },
  ],
  handlers: {
    onChange: editor => event => {
      store.forEachUploadInProgress(([id, { abortController }]) => {
        if (!uploadInProgressNodeExists(editor, id)) {
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
