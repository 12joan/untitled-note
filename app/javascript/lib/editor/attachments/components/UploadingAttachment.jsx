import React, { useLayoutEffect, useState } from 'react'
import {
  removeNodes,
  withoutSavingHistory,
} from '@udecode/plate-headless'
import { useSelected, useFocused } from 'slate-react'

import { useGlobalEvent } from '~/lib/globalEvents'
import filesize from '~/lib/filesize'
import groupedClassNames from '~/lib/groupedClassNames'
import commonClassNames from '../commonClassNames'
import store from '../store'

import Meter from '~/components/Meter'

const UploadingAttachment = ({ editor, attributes, children, element }) => {
  const { id, filename } = element

  // Remove the node if no upload is in progress
  useLayoutEffect(() => {
    if (!store.uploadIsInProgress(id)) {
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

  const className = groupedClassNames(commonClassNames, {
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

export default UploadingAttachment
