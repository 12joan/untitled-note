import React from 'react'
import { useRef, useEffect } from 'react'

import NavLink from 'components/NavLink'

const DocumentGridTile = props => {
  const documentBodyRef = useRef()
  const cardId = `document-${props.doc.id}`

  useEffect(() => {
    documentBodyRef.current.querySelectorAll('*').forEach(element => {
      // Prevent tab focus within preview
      element.setAttribute('tabindex', '-1')

      // Prevent visible scrollbars inside preview 
      element.style.overflow = 'hidden'
    })
  }, [])

  return (
    <div id={cardId} className="document-grid-tile g-col-12 g-col-sm-6 g-col-md-4 g-col-xl-3">
      <div className="document-grid-tile-card">
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
      </div>

      <label htmlFor={cardId} className="document-grid-tile-label d-block text-center py-1">
        <NavLink className="stretched-link text-decoration-none text-secondary" params={{ documentId: props.doc.id }}>
          {
            (/[^\s]/.test(props.doc.title || ''))
              ? props.doc.title 
              : (
                <span className="visually-hidden">Untitled Document</span>
              )
          }
        </NavLink>
      </label>
    </div>
  )
}

export default DocumentGridTile
