import React from 'react'
import { ThreeDotsVertical } from 'react-bootstrap-icons'

import DocumentsAPI from 'lib/resources/DocumentsAPI'
import { useContext } from 'lib/context'

const DocumentDropdownMenu = props => {
  const { projectId, setParams, reloadDocumentIndex, reloadKeywords, reloadPinnedDocuments } = useContext()

  const pinned = props.doc.pinned_at !== null

  const togglePinned = () => {
    props.updateDocument({
      pinned_at: pinned ? null : new Date().toISOString(),
    })
      .then(reloadPinnedDocuments)
  }

  const downloadAsMarkdown = () => {
    window.location.href = `/api/v1/projects/${projectId}/documents/${props.doc.id}/markdown`
  }

  const performDestroy = () => {
    DocumentsAPI(projectId).destroy(props.doc)
      .then(() => setParams({ documentId: undefined }))
      .then(reloadKeywords)
      .then(reloadDocumentIndex)
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        id={`document-${props.editorUUID}-dropdown-button`}
        className="document-dropdown-button btn btn-icon fs-4 text-secondary"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <ThreeDotsVertical className="bi" />
        <span className="visually-hidden">Toggle dropdown</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`document-${props.editorUUID}-dropdown-button`}>
        <DropdownItem onClick={togglePinned}>
          {pinned ? 'Unpin document' : 'Pin document'}
        </DropdownItem>

        <DropdownItem onClick={downloadAsMarkdown}>
          Download as Markdown
        </DropdownItem>

        <DropdownItem onClick={performDestroy} className="dropdown-item-danger">
          Delete document
        </DropdownItem>

        <div className="dropdown-divider" />

        {
          [['Created at', props.doc.created_at], ['Updated at', props.doc.updated_at]].map(([label, value]) => (
            <li key={label} className="text-secondary px-3 py-1">
              <h6 className="dropdown-header p-0">{label}</h6>
              {new Date(value).toLocaleString()}
            </li>
          ))
        }
      </ul>
    </div>
  )
}

const DropdownItem = props => {
  return (
    <li>
      <button
        type="button"
        className={`dropdown-item ${props.className || ''}`}
        onClick={props.onClick}>
        {props.children}
      </button>
    </li>
  )
}

export default DocumentDropdownMenu
