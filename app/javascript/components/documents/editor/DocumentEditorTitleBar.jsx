import React from 'react'

import DocumentDropdownMenu from 'components/documents/editor/DocumentDropdownMenu'

const DocumentEditorTitleBar = props => {
  return (
    <div className="layout-row gap-3 align-items-center">
      <div className="flex-grow-1">
        <input
          className="title-input"
          value={props.doc.title}
          placeholder="Title"
          autoFocus={props.doc.blank}
          onChange={event => {
            props.updateDocument({ title: event.target.value }, { updateImmediately: false })
          }} />
      </div>

      <DocumentDropdownMenu
        doc={props.doc}
        editorUUID={props.editorUUID}
        updateDocument={props.updateDocument} />
    </div>
  )
}

export default DocumentEditorTitleBar
