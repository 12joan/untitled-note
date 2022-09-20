import React, { useMemo } from 'react'

import { useContext } from '~/lib/context'
import useSynchronisedRecord, { BEHAVIOUR_DELAYED_UPDATE, BEHAVIOUR_UNCONTROLLED } from '~/lib/synchroniseRecords'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'

import Editor from '~/components/Editor'

const EditorView = ({ documentId }) => {
  const { futurePartialDocuments } = useContext()

  const futurePartialDocument = futurePartialDocuments.map(
    partialDocuments => partialDocuments.find(doc => doc.id == documentId)
  )

  const loadingView = (
    <div>Loading...</div>
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
  const api = useMemo(() => DocumentsAPI(projectId), [projectId])

  const futureSynchronisedRecord = useSynchronisedRecord({
    key: `document-${documentId}`,
    getRemoteVersion: doc => doc.remote_version,
    isUpToDate: version => partialDocument.remote_version <= version,
    fetchRecord: () => api.show(documentId),
    uploadRecord: (updatedDocument, uploadingVersion) => api.update({
      ...updatedDocument,
      remote_version: uploadingVersion,
    }),
    attributeBehaviours: {
      remote_version: BEHAVIOUR_UNCONTROLLED,
      title: BEHAVIOUR_DELAYED_UPDATE,
    },
  })

  return futureSynchronisedRecord.unwrap({
    pending: () => loadingView,
    resolved: ([workingDocument, updateDocument]) => (
      <div className="grow flex flex-col">
        <Editor
          workingDocument={workingDocument}
          updateDocument={updateDocument}
        />
      </div>
    ),
  })
}

export default EditorView
