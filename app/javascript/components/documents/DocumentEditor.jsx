import React from 'react'
import { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import useSynchronisedRecord from 'lib/useSynchronisedRecord'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import DocumentEditorTitleBar from 'components/documents/editor/DocumentEditorTitleBar'
import DocumentEditorKeywords from 'components/documents/editor/DocumentEditorKeywords'
import DocumentEditorBodyEditor from 'components/documents/editor/DocumentEditorBodyEditor'
import DocumentEditorFooter from 'components/documents/editor/DocumentEditorFooter'

const DocumentEditor = props => {
  const { projectId } = useContext()

  const [doc, updateDocument, syncStatus] = useSynchronisedRecord({
    initialRecord: props.document,
    synchroniseRecord: doc => {
      return DocumentsAPI(projectId).update(doc)
    },
    uncontrolledParams: ['updated_at'],
  })

  const documentEditorRef = useRef()

  const [editorUUID] = useState(() => uuid())
  const toolbarId = `trix-toolbar-${editorUUID}`

  return (
    <div
      ref={documentEditorRef}
      className={`
        document-editor d-flex flex-column
        ${props.fullHeight ? 'flex-grow-1' : ''}
        ${syncStatus === 'failed' ? 'sync-failed' : ''}
      `}>
      <DocumentEditorTitleBar
        doc={doc}
        editorUUID={editorUUID}
        updateDocument={updateDocument} />

      <div className="mb-2">
        <DocumentEditorKeywords
          doc={doc}
          updateDocument={updateDocument} />
      </div>

      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ width: 0 }}>
          <DocumentEditorBodyEditor
            doc={doc}
            toolbarId={toolbarId}
            updateDocument={updateDocument} />
        </div>
      </div>

      <DocumentEditorFooter
        toolbarId={toolbarId}
        syncStatus={syncStatus} />
    </div>
  )
}

export default DocumentEditor
