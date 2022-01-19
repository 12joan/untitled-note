import React from 'react'
import { useRef, useEffect } from 'react'
import { ThreeDots } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import NavLink from 'components/NavLink'
import LoadingPlaceholder from 'components/LoadingPlaceholder'
import DocumentDropdownMenu from 'components/documents/DocumentDropdownMenu'

const DocumentGridTile = props => {
  const { projectId } = useContext()

  const documentBodyRef = useRef()
  const cardId = `document-${props.doc.id}`

  useEffect(() => {
    documentBodyRef.current.querySelectorAll('*').forEach(element => {
      // Prevent tab focus within preview
      element.setAttribute('tabindex', '-1')

      // Prevent visible scrollbars inside preview
      // (Hiding overflow on list items interferes with visibility of bullets and numbers)
      if (element.tagName !== 'LI') {
        element.style.overflow = 'hidden'
      }
    })
  }, [])

  return (
    <DocumentGridTileContainer cardId={cardId} label={
      <label htmlFor={cardId} className="layout-row justify-content-center align-items-center py-1">
        <NavLink className="stretched-link text-decoration-none text-secondary" params={{ documentId: props.doc.id }}>
          {props.doc.safe_title}
        </NavLink>

        <DocumentDropdownMenu
          doc={props.doc}
          updateDocument={params => DocumentsAPI(projectId).update({ ...props.doc, ...params })}
          labelledBy={`document-${props.doc.id}-dropdown-button`}>
          <button
            type="button"
            id={`document-${props.doc.id}-dropdown-button`}
            className="btn btn-icon text-secondary position-relative"
            style={{ zIndex: 1 }}
            data-bs-toggle="dropdown"
            aria-expanded="false">
            <ThreeDots className="bi" />
            <span className="visually-hidden">Toggle dropdown</span>
          </button>
        </DocumentDropdownMenu>
      </label>
      }>

      <div className="document-grid-tile-preview">
        <div ref={documentBodyRef} className="document-body">
          {
            props.doc.title && (
              <h1 className="title h2 border-bottom">{props.doc.title}</h1>
            )
          }

          <div dangerouslySetInnerHTML={{ __html: props.doc.body }} />
        </div>
      </div>
    </DocumentGridTileContainer>
  )
}

const DocumentGridTilePlaceholder = props => {
  return (
    <DocumentGridTileContainer cardClassName="border-0">
      <LoadingPlaceholder className="position-absolute top-0 bottom-0" />
    </DocumentGridTileContainer>
  )
}

const DocumentGridTileContainer = props => {
  return (
    <div id={props.cardId} className="document-grid-tile g-col-12 g-col-sm-6 g-col-md-4 g-col-xl-3">
      <div className={`document-grid-tile-card ${props.cardClassName || ''}`}>
        {props.children}
      </div>

      {props.label}
    </div>
  )
}

export { DocumentGridTile, DocumentGridTilePlaceholder }
