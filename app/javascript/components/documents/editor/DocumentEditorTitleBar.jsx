import React from 'react'

import { useContext } from 'lib/context'

import DocumentDropdownMenu from 'components/documents/editor/DocumentDropdownMenu'

const DocumentEditorTitleBar = props => {
  const { reloadPinnedDocuments } = useContext()

  return (
    <div className="row gx-3 align-items-center">
      <div className="col flex-grow-1">
        <input
          className="title-input"
          value={props.doc.title}
          placeholder="Title"
          readOnly={props.readOnly}
          onChange={event => {
            props.updateDocument({ title: event.target.value })
              .then(reloadPinnedDocuments)
          }} />
      </div>

      <div className="col-auto">
        <DocumentDropdownMenu
          doc={props.doc}
          editorUUID={props.editorUUID}
          updateDocument={props.updateDocument} />
      </div>
    </div>
  )
}

export default DocumentEditorTitleBar
