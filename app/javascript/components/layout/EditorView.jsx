import React, { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useSynchronisedRecord from '~/lib/synchroniseRecords'
import { documentWasViewed } from '~/lib/recentlyViewedDocuments'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import { ProjectLink } from '~/lib/routes'

import LoadingView from '~/components/LoadingView'
import Editor from '~/components/Editor'

const EditorView = ({ documentId }) => {
  const { futurePartialDocuments } = useContext()

  const futurePartialDocument = futurePartialDocuments.map(
    partialDocuments => partialDocuments.find(doc => doc.id == documentId) || { remote_version: Math.infinity }
  )

  const loadingView = (
    <LoadingView />
  )

  return futurePartialDocument.unwrap({
    pending: () => loadingView,
    resolved: partialDocument => (
      <WithParitalDocument
        documentId={documentId}
        partialDocument={partialDocument}
        loadingView={loadingView}
      />
    ),
  })
}

const WithParitalDocument = ({ documentId, partialDocument, loadingView }) => {
  const { projectId } = useContext()
  const [searchParams] = useSearchParams()
  const isFromRecentlyViewed = searchParams.has('recently_viewed')
  const api = useMemo(() => DocumentsAPI(projectId), [projectId])

  useEffect(() => {
    if (!isFromRecentlyViewed) {
      documentWasViewed(documentId)
    }
  }, [isFromRecentlyViewed, documentId])

  const fsrSynchronisedRecord = useSynchronisedRecord({
    key: `document-${documentId}`,
    getRemoteVersion: doc => doc.remote_version,
    isUpToDate: version => partialDocument.remote_version <= version,
    fetchRecord: () => api.show(documentId),
    uploadRecord: (updatedDocument, uploadingVersion) => api.update({
      ...updatedDocument,
      remote_version: uploadingVersion,
    }),
    attributeBehaviours: {
      remote_version: { merge: (local, remote) => remote },
      tags: {
        merge: (local, remote) => local.map(localTag => localTag.id
          ? localTag
          : remote.find(remoteTag => remoteTag.text === localTag.text)
        ),
      },
      title: { delayedUpdate: true },
      body: { delayedUpdate: true },
      body_type: { delayedUpdate: true },
      plain_body: { delayedUpdate: true },
    },
  })

  return fsrSynchronisedRecord.unwrap({
    pending: () => loadingView,
    success: ([workingDocument, updateDocument, errorDuringUpload]) => (
      // TODO: Handle errorDuringUpload

      <div className="grow flex flex-col">
        <Editor
          workingDocument={workingDocument}
          updateDocument={updateDocument}
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
          <h1 className="text-3xl font-medium">{heading}</h1>
          <p className="text-lg font-light">{explanation}</p>
          <p><ProjectLink className="btn btn-link">Go back</ProjectLink></p>
        </div>
      )
    },
  })
}

export default EditorView
