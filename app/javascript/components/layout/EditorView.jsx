import React, { useRef, useMemo, useEffect, useReducer } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useStateWhileMounted from '~/lib/useStateWhileMounted'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import { FutureServiceResult } from '~/lib/future'
import useTitle from '~/lib/useTitle'
import { documentWasViewed } from '~/lib/recentlyViewedDocuments'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import { OverviewLink } from '~/lib/routes'

import LoadingView from '~/components/LoadingView'
import Editor from '~/components/Editor'

const EditorView = ({ documentId }) => {
  const { projectId, futurePartialDocuments } = useContext()
  const [searchParams] = useSearchParams()
  const isFromRecentlyViewed = searchParams.has('recently_viewed')

  const { current: clientId } = useRef(Math.random().toString(36).slice(2))

  const futurePartialDocument = useMemo(() => futurePartialDocuments
    .map(partialDocuments => partialDocuments.find(
      partialDocument => partialDocument.id === documentId
    )),
    [futurePartialDocuments, documentId]
  )

  const safeTitle = futurePartialDocument.map(partialDocument => partialDocument?.safe_title).orDefault(undefined)
  const updatedBy = futurePartialDocument.map(partialDocument => partialDocument?.updated_by).orDefault(undefined)
  const updatedAt = futurePartialDocument.map(partialDocument => partialDocument?.updated_at).orDefault(undefined)

  useTitle(safeTitle || 'Loading…')

  useEffect(() => {
    if (!isFromRecentlyViewed) {
      documentWasViewed(documentId)
    }
  }, [isFromRecentlyViewed, documentId])

  const [fsrInitialDocument, setFsrInitialDocument] = useStateWhileMounted(() => FutureServiceResult.pending())
  const [refetchKey, refetch] = useReducer(refetchKey => refetchKey + 1, 0)

  useEffectAfterFirst(() => {
    if (updatedBy && updatedBy !== clientId) {
      refetch()
    }
  }, [updatedAt], updatedAt !== undefined)

  useEffect(() => {
    setFsrInitialDocument(FutureServiceResult.pending())

    FutureServiceResult.fromPromise(
      DocumentsAPI(projectId).show(documentId),
      setFsrInitialDocument
    )
  }, [projectId, documentId, refetchKey])

  return fsrInitialDocument.unwrap({
    pending: () => <LoadingView />,
    success: initialDocument => (
      <div className="grow flex flex-col">
        <Editor
          clientId={clientId}
          initialDocument={initialDocument}
        />
      </div>
    ),
    failure: error => {
      const doesNotExist = error?.response?.status === 404

      if (!doesNotExist) {
        console.error(error)
      }

      const { heading, explanation } = doesNotExist
        ? {
          heading: 'Document not found',
          explanation: 'This document does not exist.',
        }
        : {
          heading: 'Error loading document',
          explanation: 'An error occurred while loading this document. Make sure you are connected to the internet and try again.',
        }

      return (
        <div className="narrow space-y-3">
          <h1 className="h1">{heading}</h1>
          <p className="text-lg font-light">{explanation}</p>
          <p><OverviewLink className="btn btn-link">Go back</OverviewLink></p>
        </div>
      )
    },
  })
}

export default EditorView
