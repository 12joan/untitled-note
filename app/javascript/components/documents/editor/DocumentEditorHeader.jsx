import React from 'react'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import NavLink from 'components/NavLink'

const DocumentEditorHeader = props => {
  return (
    <>
      {
        props.openable && (
          <div className="document-editor-header dim-on-hover position-relative d-flex justify-content-center align-items-center">
            <NavLink
              className="stretched-link document-editor-header-link text-secondary text-decoration-none"
              params={{ documentId: props.doc.id }}>
              <BoxArrowUpRight className="bi" /> Open document
            </NavLink>
          </div>
        )
      }
    </>
  )
}

export default DocumentEditorHeader
