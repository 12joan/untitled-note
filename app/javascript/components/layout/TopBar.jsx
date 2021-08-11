import React from 'react'
import { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import BlankDocumentAPI from 'lib/resources/BlankDocumentAPI'

const TopBar = props => {
  const { projectId, setParams } = useContext()

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
    <nav className="navbar navbar-light border-bottom d-flex justify-content-end p-2">
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
