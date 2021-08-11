import React from 'react'
import { ThreeDots } from 'react-bootstrap-icons'

import DocumentsAPI from 'lib/resources/DocumentsAPI'
import { useContext } from 'lib/context'

const DocumentDropdownMenu = props => {
  const { projectId, documentId, setParams, reloadDocumentIndex, reloadKeywords } = useContext()

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
        { 
          props.isDeleted
            ? (
              <>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={revertSoftDeletion}>
                    Recover document
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="dropdown-item dropdown-item-danger"
                    onClick={performDestroy}>
                    Delete permanently
                  </button>
                </li>
              </>
            )

            : (
              <>
                <li>
                  <button
                    type="button"
                    className="dropdown-item dropdown-item-danger"
                    onClick={performSoftDeletion}>
                    Delete document
                  </button>
                </li>
              </>
            )
        }
      </ul>
    </div>
  )
}

export default DocumentDropdownMenu
