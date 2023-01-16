import React, { useEffect, useState } from 'react'
import { useSelected, useFocused } from 'slate-react'

import { useContext } from '~/lib/context'
import { FutureServiceResult } from '~/lib/future'
import retry from '~/lib/retry'
import S3FilesAPI from '~/lib/resources/S3FilesAPI'
import { useGlobalEvent } from '~/lib/globalEvents'
import { useEditorEvent } from '~/lib/editor/imperativeEvents'

import PendingAttachment from './PendingAttachment'
import DeletedAttachment from './DeletedAttachment'
import GenericAttachment from './GenericAttachment'
import ImageAttachment from './ImageAttachment'

const Attachment = ({ attributes, children, element }) => {
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
    <div {...attributes} className="not-prose">
      <div contentEditable={false}>
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
      </div>

      {children}
    </div>
  )
}

export default Attachment
