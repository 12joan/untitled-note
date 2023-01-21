import {
  getPluginOptions,
  insertNodes,
  removeNodes,
} from '@udecode/plate-headless'

import uploadFile from '~/lib/uploadFile'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { handleUploadFileError } from '~/lib/handleErrors'
import { ELEMENT_ATTACHMENT } from './constants'
import uploadsInProgressStore from './uploadsInProgressStore'
import {
  removeAllAttachmentNodes,
  nodeAtPathIsEmptyParagraph,
} from './utils'

const insertAttachments = (editor, blockIndex, files) => handleUploadFileError(
  new Promise((resolve, reject) => {
    const { projectId, availableSpace, showFileStorage } = getPluginOptions(editor, ELEMENT_ATTACHMENT)

    const requiredSpace = files.reduce((total, file) => total + file.size, 0)

    if (requiredSpace > availableSpace) {
      reject({
        reason: 'notEnoughSpace',
        data: {
          requiredSpace,
          availableSpace,
          showFileStorage,
        },
      })
      return
    }

    if (nodeAtPathIsEmptyParagraph(editor, [blockIndex])) {
      removeNodes(editor, {
        at: [blockIndex],
      })
    }

    const addedIndices = []

    files.forEach((file, index) => {
      let s3FileId = null

      const abortController = new AbortController()

      const handleUploadStart = ({ id }) => {
        s3FileId = id

        uploadsInProgressStore.register(s3FileId, { abortController })

        const attachmentNode = {
          type: ELEMENT_ATTACHMENT,
          children: [{ text: '' }],
          s3FileId,
          filename: file.name,
        }

        // The index (relative to blockIndex) we want to insert the attachment
        // node at is equal to the number of nodes whose indices are less than
        // ours that have been added so far.
        const relativeIndex = addedIndices.filter(i => i < index).length
        addedIndices.push(index)

        insertNodes(editor, attachmentNode, {
          at: [blockIndex + relativeIndex],
        })
      }

      const handleUploadProgress = progressEvent => dispatchGlobalEvent('s3File:uploadProgress', {
        s3FileId,
        progressEvent,
      })

      uploadFile({
        projectId,
        file,
        role: 'attachment',
        abortSignal: abortController.signal,
        onUploadStart: handleUploadStart,
        onUploadProgress: handleUploadProgress,
      })
        .then(() => {
          uploadsInProgressStore.remove(s3FileId)
          dispatchGlobalEvent('s3File:uploadComplete', { s3FileId })
        })
        .catch(error => {
          if (s3FileId !== null) {
            removeAllAttachmentNodes(editor, s3FileId)
          }

          uploadsInProgressStore.remove(s3FileId)

          if (error.name !== 'CanceledError') {
            throw error
          }
        })
        .then(resolve, reject)
    })
  })
)

export default insertAttachments