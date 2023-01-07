import React, { useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'

import {
  createPluginFactory,
  getPluginOptions,
  getNode,
  insertNodes,
  someNode,
  getNodeEntries,
  removeNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-headless'
import { useSelected, useFocused } from 'slate-react'

import { useContext } from '~/lib/context'
import uploadFile from '~/lib/uploadFile'
import groupedClassNames from '~/lib/groupedClassNames'
import { useEditorEvent } from '~/lib/editor/imperativeEvents'
import { FutureServiceResult } from '~/lib/future'
import S3FilesAPI from '~/lib/resources/S3FilesAPI'
import friendlyMime from '~/lib/friendlyMime'
import filesize from '~/lib/filesize'
import { useGlobalEvent, dispatchGlobalEvent } from '~/lib/globalEvents'
import retry from '~/lib/retry'
import findDragPath from '~/lib/editor/findDragPath'
import { handleUploadFileError } from '~/lib/handleErrors'

import LoadingView from '~/components/LoadingView'
import Meter from '~/components/Meter'
import Tooltip from '~/components/Tooltip'
import DownloadIcon from '~/components/icons/DownloadIcon'

const ELEMENT_ATTACHMENT = 'attachment'
const ELEMENT_UPLOADING_ATTACHMENT = 'uploadingAttachment'

const uploadsInProgress = {}

const matchUploadInProgressNode = id => node => (
  node.type === ELEMENT_UPLOADING_ATTACHMENT &&
  node.id === id
)

const uploadInProgressNodeExists = (editor, id) => someNode(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

const findAllUploadInProgressNodes = (editor, id) => getNodeEntries(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

const removeAllUploadInProgressNodes = (editor, id) => removeNodes(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

const setDragCursorPosition = position => {
  Array.from(document.querySelectorAll('[data-slate-editor] > *')).forEach((element, index) => {
    if (index === position) {
      element.classList.add('drag-cursor-above')
    } else {
      element.classList.remove('drag-cursor-above')
    }
  })
}

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

      uploadsInProgress[tempId] = { abortController }

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
          delete uploadsInProgress[tempId]
        })
        .then(resolve, reject)
    })
  })
)

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
      Object.entries(uploadsInProgress).forEach(([id, { abortController }]) => {
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
        // TODO: Do not add 1 if the path refers to an empty paragraph or if
        // the cursor is at the start of the block
        insertAttachments(editor, editor.selection.anchor.path[0] + 1, files)
      }
    },
  },
})

const useAttachmentPlugins = () => {
  const { projectId, futureRemainingQuota, showAccountModal } = useContext()

  return useMemo(() => [
    createAttachmentPlugin({
      options: {
        projectId,
        availableSpace: futureRemainingQuota.orDefault(Infinity),
        showFileStorage: () => showAccountModal({ initialSection: 'fileStorage' }),
      },
    }),
  ], [projectId, futureRemainingQuota])
}

const cardClassNames = {
  border: 'border dark:border-transparent',
  bg: 'dark:bg-slate-800',
  padding: 'p-3',
  rounded: 'rounded-lg',
  reset: 'not-prose text-ui',
  select: 'select-none',
  display: 'flex gap-2 items-center',
}

const UploadingAttachmentComponent = ({ editor, attributes, children, element }) => {
  const { id, filename } = element

  // Remove the node if no upload is in progress
  useLayoutEffect(() => {
    if (!uploadsInProgress[id]) {
      withoutSavingHistory(editor, () => {
        removeNodes(editor, {
          at: [],
          match: matchUploadInProgressNode(id),
        })
      })
    }
  }, [])

  const [uploadedBytes, setUploadedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState(Infinity)

  useGlobalEvent('s3File:uploadProgress', ({ id: eventId, progressEvent }) => {
    if (eventId === id) {
      setUploadedBytes(progressEvent.loaded)
      setTotalBytes(progressEvent.total)
    }
  }, [id])

  const selected = useSelected()
  const focused = useFocused()
  const selectedAndFocused = selected && focused

  const className = groupedClassNames(cardClassNames, {
    display: null,
    spacing: 'space-y-2',
    focusRing: selectedAndFocused && 'focus-ring',
  })

  return (
    <div {...attributes} contentEditable={false}>
      <div className={className}>
        <div>
          Uploading <span className="font-medium">{filename}</span>
        </div>

        <Meter value={uploadedBytes} max={totalBytes} />

        <div className="text-sm text-slate-500 dark:text-slate-400" role="status">
          {filesize(uploadedBytes)} of {totalBytes === Infinity ? '?' : filesize(totalBytes)} uploaded
        </div>
      </div>

      {children}
    </div>
  )
}

const AttachmentComponent = ({ attributes, children, element }) => {
  const { s3FileId } = element

  const { projectId } = useContext()
  const [fsrFetchedData, setFsrFetchedData] = useState(FutureServiceResult.pending())

  useEffect(() => {
    FutureServiceResult.fromPromise(
      retry(() => S3FilesAPI(projectId).show(s3FileId), {
        maxRetries: Infinity,
        shouldRetry: error => error.response?.status !== 404,
      }),
      setFsrFetchedData
    )
  }, [])

  useGlobalEvent('s3File:delete', ({ s3FileId: deletedS3FileId }) => {
    if (deletedS3FileId === s3FileId) {
      setFsrFetchedData(FutureServiceResult.failure())
    }
  })

  const selected = useSelected()
  const focused = useFocused()
  const selectedAndFocused = selected && focused

  const useOnEnter = handler => useEditorEvent.onKeyDown(event => {
    if (selectedAndFocused && event.key === 'Enter') {
      handler()
    }
  }, [selectedAndFocused])

  const commonProps = {
    selectedClassNames: {
      focusRing: selectedAndFocused && 'focus-ring',
    },
    useOnEnter,
  }

  return (
    <div {...attributes} contentEditable={false}>
      {fsrFetchedData.unwrap({
        pending: () => (
          <PendingAttachment {...commonProps} />
        ),
        failure: () => (
          <DeletedAttachment {...commonProps} />
        ),
        success: s3File => (/^image\/(?!svg\+xml$)/.test(s3File.content_type)
          ? <ImageAttachment {...commonProps} s3File={s3File} />
          : <GenericAttachment {...commonProps} s3File={s3File} />
        ),
      })}

      {children}
    </div>
  )
}

const PendingAttachment = ({ selectedClassNames }) => {
  const className = groupedClassNames(cardClassNames, selectedClassNames, {
    padding: 'p-5',
  })

  return (
    <div className={className}>
      <LoadingView style={{ paddingBottom: 0 }} showImmediately />
    </div>
  )
}

const DeletedAttachment = ({ selectedClassNames }) => {
  const className = groupedClassNames(cardClassNames, selectedClassNames, {
    reset: null,
    color: 'text-slate-500 dark:text-slate-400',
  })

  return (
    <div className={className}>
      Deleted file
    </div>
  )
}

const ImageAttachment = ({ s3File, selectedClassNames }) => {
  const className = groupedClassNames(selectedClassNames, {
    rounded: 'rounded-lg',
    margin: 'mx-auto',
    ringOffset: 'ring-offset-2',
  })

  const { url, filename } = s3File

  return (
    <img src={url} alt={filename} className={className} />
  )
}

const GenericAttachment = ({ s3File, selectedClassNames, useOnEnter }) => {
  const buttonRef = useRef()
  useOnEnter(() => buttonRef.current.click())

  const className = groupedClassNames(cardClassNames, selectedClassNames)

  const {
    filename,
    content_type: contentType,
    size,
    url,
  } = s3File

  return (
    <div className={className}>
      <div className="grow">
        {filename}

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {friendlyMime(contentType)} &middot; {filesize(size)}
        </div>
      </div>

      <Tooltip content="Download file">
        <a
          ref={buttonRef}
          href={url}
          target="_blank"
          className="block btn p-3 aspect-square text-slate-500 dark:text-slate-400 hocus:text-ui"
          onClick={event => event.stopPropagation()}
        >
          <DownloadIcon size="1.25em" ariaLabel="Download file" />
        </a>
      </Tooltip>
    </div>
  )
}

export {
  ELEMENT_ATTACHMENT,
  ELEMENT_UPLOADING_ATTACHMENT,
  useAttachmentPlugins,
  AttachmentComponent,
  UploadingAttachmentComponent,
}
