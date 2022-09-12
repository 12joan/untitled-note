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
    <div className="flex gap-3 items-center">
      <input
        className="grow text-3xl font-medium bg-transparent"
        value={props.doc.title || ''}
        placeholder="Title"
        autoFocus={props.doc.blank}
        onChange={event => {
          props.updateDocument({ title: event.target.value }, { updateImmediately: false })
        }}
        onKeyDown={handleKeyDown} />

      {/*<DocumentDropdownMenu
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
      </DocumentDropdownMenu>*/}
    </div>
  )
}

export default DocumentEditorTitleBar
