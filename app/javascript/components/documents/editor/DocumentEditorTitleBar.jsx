import React from 'react'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import DocumentDropdownMenu from 'components/documents/editor/DocumentDropdownMenu'

const DocumentEditorTitleBar = props => {
  return (
    <div className="row gx-3 align-items-center">
      <div className="col flex-grow-1">
        <input
          className="title-input"
          value={props.doc.title}
          placeholder="Title"
          onChange={event => {
            props.updateDocument({ title: event.target.value })
          }} />
      </div>

      <div className="col-auto d-flex gap-2">
        <DocumentDropdownMenu
          doc={props.doc}
          editorUUID={props.editorUUID}
          updateDocument={props.updateDocument} />
      </div>
    </div>
  )
}

export default DocumentEditorTitleBar
