import React from 'react'

import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import { useContext } from '~/lib/context'

const DocumentDropdownMenu = props => {
  const { projectId, setParams } = useContext()

  const pinned = props.doc.pinned_at !== null

  const togglePinned = () => {
    props.updateDocument({
      pinned_at: pinned ? null : new Date().toISOString(),
    })
  }

  const downloadAsMarkdown = () => {
    window.location.href = `/api/v1/projects/${projectId}/documents/${props.doc.id}/markdown`
  }

  const performDestroy = () => {
    DocumentsAPI(projectId).destroy(props.doc)
      .then(() => setParams({ documentId: undefined }))
  }

  return (
    <div className="dropdown">
      {props.children}

      <ul className="dropdown-menu" aria-labelledby={props.labelledby}>
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
