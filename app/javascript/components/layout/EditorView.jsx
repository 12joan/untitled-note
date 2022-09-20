import React, { useMemo } from 'react'

import { useContext } from '~/lib/context'
import useSynchronisedRecord, { BEHAVIOUR_DELAYED_UPDATE, BEHAVIOUR_UNCONTROLLED } from '~/lib/synchroniseRecords'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'

import Editor from '~/components/Editor'

const EditorView = ({ documentId }) => {
  const { projectId } = useContext()
  const api = useMemo(() => DocumentsAPI(projectId), [projectId])

  const [futureDocument, updateDocument] = useSynchronisedRecord({
    key: `document-${documentId}`,
    fetchRecord: () => api.show(documentId),
    uploadRecord: updatedDocument => api.update(updatedDocument),
    attributeBehaviours: {
      title: BEHAVIOUR_DELAYED_UPDATE,
    },
  })

  return (
    <div className="grow flex flex-col">
      {futureDocument.unwrap({
        pending: () => <div>Loading...</div>,
        resolved: workingDocument => (
          <Editor
            workingDocument={workingDocument}
            updateDocument={updateDocument}
          />
        ),
      })}
    </div>
  )
}

export default EditorView
