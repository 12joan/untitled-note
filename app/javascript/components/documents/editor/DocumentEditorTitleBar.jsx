import React from 'react'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import DocumentDropdownMenu from 'components/documents/editor/DocumentDropdownMenu'
import NavLink from 'components/NavLink'

const DocumentEditorTitleBar = props => {
  const { reloadPinnedDocuments } = useContext()

  return (
    <div className="row gx-3 align-items-center">
      <div className="col flex-grow-1">
        <input
          className="title-input"
          value={props.doc.title}
          placeholder="Title"
          readOnly={props.readOnly}
          onChange={event => {
            props.updateDocument({ title: event.target.value })
              .then(reloadPinnedDocuments)
          }} />
      </div>

      <div className="col-auto d-flex gap-2">
        <DocumentDropdownMenu
          doc={props.doc}
          editorUUID={props.editorUUID}
          updateDocument={props.updateDocument} />

        {
          props.showOpenButton && (
            <NavLink
              className="open-document-button btn btn-icon fs-4 text-secondary"
              params={{ documentId: props.doc.id }}
              title="Open Document">
              <BoxArrowUpRight className="bi" style={{ transform: 'scale(0.75)' }} />
              <span className="visually-hidden">Open Document</span>
            </NavLink>
          )
        }
      </div>
    </div>
  )
}

export default DocumentEditorTitleBar
