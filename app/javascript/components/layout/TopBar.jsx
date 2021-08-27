import React from 'react'
import { useState } from 'react'
import { LayoutSidebar, PencilSquare } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import BlankDocumentAPI from 'lib/resources/BlankDocumentAPI'

const TopBar = props => {
  const { projectId, setParams, toggleSidebarEvent } = useContext()

  const [loadingBlankDocument, setLoadingBlankDocument] = useState(false)

  const openBlankDocument = () => {
    if (loadingBlankDocument) {
      return
    }

    setLoadingBlankDocument(true)

    BlankDocumentAPI(projectId).create()
      .then(doc => setParams({ documentId: doc.id }))
      .catch(console.error)
      .then(() => setLoadingBlankDocument(false))
  }

  return (
    <nav className="navbar navbar-light border-bottom d-flex justify-content-between p-2">
      <button
        type="button"
        className="btn btn-lg btn-icon btn-icon-inline text-secondary"
        title="Toggle sidebar"
        onClick={toggleSidebarEvent.invoke}>
        <LayoutSidebar className="bi" />
        <span className="visually-hidden">Toggle sidebar</span>
      </button>

      <button
        className="btn btn-dark"
        onClick={openBlankDocument}
        disabled={loadingBlankDocument}>
        <PencilSquare className="bi" /> New document
      </button>
    </nav>
  )
}

export default TopBar
