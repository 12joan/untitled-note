import React from 'react'
import { ThreeDots } from 'react-bootstrap-icons'

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

  const performSoftDeletion = () => {
    props.updateDocument({ deleted_at: new Date().toISOString() })
      .then(() => setParams({ documentId: undefined }))
      .then(reloadDocumentIndex)
  }

  const revertSoftDeletion = () => {
    props.updateDocument({ deleted_at: null })
      .then(reloadDocumentIndex)
  }

  const performDestroy = () => {
    DocumentsAPI(projectId).destroy(props.doc)
      .then(() => setParams({ documentId: 'deleted' }))
      .then(reloadKeywords)
      .then(reloadDocumentIndex)
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        id={`document-${props.editorUUID}-dropdown-button`}
        className="btn btn-icon fs-4 text-secondary"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <ThreeDots className="bi" />
        <span className="visually-hidden">Toggle dropdown</span>
      </button>

      <ul className="dropdown-menu" aria-labelledby={`document-${props.editorUUID}-dropdown-button`}>
        <DropdownItem onClick={togglePinned}>
          {pinned ? 'Unpin document' : 'Pin document'}
        </DropdownItem>

        <DropdownItem onClick={downloadAsMarkdown}>
          Download as Markdown
        </DropdownItem>

        { 
          props.isDeleted
            ? (
              <>
                <DropdownItem onClick={revertSoftDeletion}>
                  Recover document
                </DropdownItem>

                <DropdownItem onClick={performDestroy} className="dropdown-item-danger">
                  Delete permanently
                </DropdownItem>
              </>
            )

            : (
              <>
                <DropdownItem onClick={performSoftDeletion} className="dropdown-item-danger">
                  Delete document
                </DropdownItem>
              </>
            )
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
