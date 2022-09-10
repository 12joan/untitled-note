import React from 'react'
import { ThreeDotsVertical } from 'react-bootstrap-icons'

import DocumentDropdownMenu from '~/components/documents/DocumentDropdownMenu'

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
        value={props.doc.title || ''}
        placeholder="Title"
        autoFocus={props.doc.blank}
        onChange={event => {
          props.updateDocument({ title: event.target.value }, { updateImmediately: false })
        }}
        onKeyDown={handleKeyDown} />

      <DocumentDropdownMenu
        doc={props.doc}
        updateDocument={props.updateDocument}
        labelledBy={`document-${props.editorUUID}-dropdown-button`}>
        <button
          type="button"
          id={`document-${props.editorUUID}-dropdown-button`}
          className="document-dropdown-button btn btn-icon fs-4 text-secondary"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <ThreeDotsVertical className="bi" />
          <span className="visually-hidden">Toggle dropdown</span>
        </button>
      </DocumentDropdownMenu>
    </div>
  )
}

export default DocumentEditorTitleBar
