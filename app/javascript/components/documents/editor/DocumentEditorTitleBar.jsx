import React from 'react'

import DocumentDropdownMenu from 'components/documents/editor/DocumentDropdownMenu'

const DocumentEditorTitleBar = props => {
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      document.querySelector('trix-editor').focus()
    }
  }

  return (
    <div className="layout-row gap-3 align-items-center">
      <input
        className="title-input flex-grow-1 h1 rounded-0 border-0 border-bottom p-0"
        value={props.doc.title}
        placeholder="Title"
        autoFocus={props.doc.blank}
        onChange={event => {
          props.updateDocument({ title: event.target.value }, { updateImmediately: false })
        }}
        onKeyDown={handleKeyDown} />

      <DocumentDropdownMenu
        doc={props.doc}
        editorUUID={props.editorUUID}
        updateDocument={props.updateDocument} />
    </div>
  )
}

export default DocumentEditorTitleBar
