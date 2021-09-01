import React from 'react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import useSynchronisedRecord from 'lib/useSynchronisedRecord'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import DocumentEditorTitleBar from 'components/documents/editor/DocumentEditorTitleBar'
import DocumentEditorKeywords from 'components/documents/editor/DocumentEditorKeywords'
import DocumentEditorBodyEditor from 'components/documents/editor/DocumentEditorBodyEditor'
import DocumentEditorFooter from 'components/documents/editor/DocumentEditorFooter'

const DocumentEditor = props => {
  const { projectId, loadDocumentCache } = useContext()

  const [doc, updateDocument, syncStatus] = useSynchronisedRecord({
    initialRecord: props.document,
    synchroniseRecord: doc => {
      const priorCachedVersion = loadDocumentCache.pull(doc.id)

      loadDocumentCache.push(doc.id, doc)

      return DocumentsAPI(projectId)
        .update(doc)
        .catch(error => {
          loadDocumentCache.push(doc.id, priorCachedVersion)
          return Promise.reject(error)
        })
    },
    uncontrolledParams: ['updated_at'],
  })

  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`

  return (
    <div className={`document-editor ${props.readOnly ? 'readOnly' : ''} ${syncStatus === 'failed' ? 'sync-failed' : ''}`}>
      <DocumentEditorTitleBar
        doc={doc}
        readOnly={props.readOnly}
        editorUUID={editorUUID}
        updateDocument={updateDocument}
        showOpenButton={props.openable} />

      <div className="mb-2">
        <DocumentEditorKeywords
          doc={doc}
          updateDocument={updateDocument}
          readOnly={props.readOnly} />
      </div>

      <div className="d-flex">
        <div className="flex-grow-1 overflow-auto" style={{ width: 0 }}>
          <DocumentEditorBodyEditor
            doc={doc}
            readOnly={props.readOnly}
            startCollapsedIfLong={props.startCollapsedIfLong}
            toolbarId={toolbarId}
            updateDocument={updateDocument} />
        </div>
      </div>

      <DocumentEditorFooter
        toolbarId={toolbarId}
        readOnly={props.readOnly}
        syncStatus={syncStatus} />
    </div>
  )
}

export default DocumentEditor
