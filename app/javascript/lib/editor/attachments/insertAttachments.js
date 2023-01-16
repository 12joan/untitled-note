import {
  createPluginFactory,
  getPluginOptions,
  insertNodes,
  removeNodes,
  getNodeEntries,
  withoutNormalizing,
} from '@udecode/plate-headless'

import uploadFile from '~/lib/uploadFile'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { handleUploadFileError } from '~/lib/handleErrors'
import { ELEMENT_ATTACHMENT, ELEMENT_UPLOADING_ATTACHMENT } from './constants'
import uploadsInProgressStore from './uploadsInProgressStore'
import {
  findAllUploadInProgressNodes,
  removeAllUploadInProgressNodes,
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

    files.forEach((file, index) => {
      const tempId = Math.random().toString(36).substring(2)

      const uploadingAttachmentNode = {
        type: ELEMENT_UPLOADING_ATTACHMENT,
        children: [{ text: '' }],
        id: tempId,
        filename: file.name,
      }

      insertNodes(editor, uploadingAttachmentNode, {
        at: [blockIndex + index],
      })

      const abortController = new AbortController()

      uploadsInProgressStore.register(tempId, { abortController })

      uploadFile({
        projectId,
        file,
        role: 'attachment',
        abortSignal: abortController.signal,
        onUploadProgress: progressEvent => dispatchGlobalEvent('s3File:uploadProgress', {
          id: tempId,
          progressEvent,
        }),
      })
        .then(({ id: s3FileId }) => {
          Array.from(
            findAllUploadInProgressNodes(editor, tempId)
          ).forEach(([, path]) => {
            withoutNormalizing(editor, () => {
              const attachmentNode = {
                type: ELEMENT_ATTACHMENT,
                children: [{ text: '' }],
                s3FileId,
              }

              removeNodes(editor, { at: path })
              insertNodes(editor, attachmentNode, { at: path })
            })
          })
        })
        .catch(error => {
          removeAllUploadInProgressNodes(editor, tempId)

          if (error.name !== 'CanceledError') {
            throw error
          }
        })
        .finally(() => {
          uploadsInProgressStore.remove(tempId)
        })
        .then(resolve, reject)
    })
  })
)

export default insertAttachments
