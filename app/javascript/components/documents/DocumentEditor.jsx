import React from 'react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import useSynchronisedRecord from 'lib/useSynchronisedRecord'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import DocumentEditorHeader from 'components/documents/editor/DocumentEditorHeader'
import DocumentEditorTitleBar from 'components/documents/editor/DocumentEditorTitleBar'
import DocumentEditorKeywords from 'components/documents/editor/DocumentEditorKeywords'
import DocumentEditorBodyEditor from 'components/documents/editor/DocumentEditorBodyEditor'
import DocumentEditorFooter from 'components/documents/editor/DocumentEditorFooter'

const DocumentEditor = props => {
  const { projectId } = useContext()

  const [doc, updateDocument] = useSynchronisedRecord({
    initialRecord: props.document,
    synchroniseRecord: doc => DocumentsAPI(projectId).update(doc),
  })

  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`

  return (
    <div className={`document-editor ${props.readOnly ? 'readOnly' : ''}`}>
      <div className="container-fluid">
        <DocumentEditorHeader
          doc={doc}
          openable={props.openable} />

        <DocumentEditorTitleBar
          doc={doc}
          readOnly={props.readOnly}
          editorUUID={editorUUID}
          updateDocument={updateDocument} />
      </div>

      <div className="row mb-2">
        <div className="col">
          <DocumentEditorKeywords
            doc={doc}
            updateDocument={updateDocument}
            readOnly={props.readOnly} />
        </div>
      </div>

      <div>
        <DocumentEditorBodyEditor
          doc={doc}
          readOnly={props.readOnly}
          startCollapsedIfLong={props.startCollapsedIfLong}
          toolbarId={toolbarId}
          updateDocument={updateDocument} />

        <DocumentEditorFooter
          toolbarId={toolbarId}
          readOnly={props.readOnly} />
      </div>
    </div>
  )
}

export default DocumentEditor
