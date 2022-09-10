import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import { useContext } from '~/lib/context'
import useSynchronisedRecord from '~/lib/useSynchronisedRecord'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import useTitle from '~/lib/useTitle'
import classList from '~/lib/classList'

import DocumentEditorSyncFailedToast from '~/components/documents/editor/DocumentEditorSyncFailedToast'
import DocumentEditorTitleBar from '~/components/documents/editor/DocumentEditorTitleBar'
import DocumentEditorKeywords from '~/components/documents/editor/DocumentEditorKeywords'
import DocumentEditorBodyEditor from '~/components/documents/editor/DocumentEditorBodyEditor'
import DocumentEditorFooter from '~/components/documents/editor/DocumentEditorFooter'

const DocumentEditor = props => {
  const { projectId } = useContext()

  const [doc, updateDocument, syncStatus] = useSynchronisedRecord({
    initialRecord: props.document,
    synchroniseRecord: doc => Promise.race([
      DocumentsAPI(projectId).update(doc),
      new Promise((resolve, reject) => setTimeout(() => reject('Update timed out'), 10000)),
    ]),
    uncontrolledParams: ['updated_at', 'safe_title'],
  })

  useTitle(doc.safe_title, { layer: 2 })

  const documentEditorRef = useRef()

  const [editorUUID] = useState(() => uuid())
  const toolbarId = `trix-toolbar-${editorUUID}`

  return (
    <>
      <div ref={documentEditorRef} className="document-editor layout-column flex-grow-1">
        {
          syncStatus === 'failed' && (
            <DocumentEditorSyncFailedToast />
          )
        }

        <DocumentEditorTitleBar
          doc={doc}
          editorUUID={editorUUID}
          updateDocument={updateDocument} />

        <div className="mb-2">
          <DocumentEditorKeywords
            doc={doc}
            updateDocument={updateDocument} />
        </div>

        <div className="flex-grow-1 d-flex mx-n3 mb-n3">
          <div className="flex-grow-1 d-flex flex-column overflow-auto" style={{ width: 0 }}>
            <DocumentEditorBodyEditor
              doc={doc}
              toolbarId={toolbarId}
              updateDocument={updateDocument} />
          </div>
        </div>
      </div>

      {
        ReactDOM.createPortal(
          <DocumentEditorFooter toolbarId={toolbarId} syncStatus={syncStatus} />,
          props.footerEl,
        )
      }
    </>
  )
}

export default DocumentEditor
