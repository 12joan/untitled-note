import React from 'react'
import { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'

import { useContext } from '~/lib/context'
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI'

const NewDocumentButton = props => {
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
    <button
      id="new-document-button"
      className="btn btn-light btn-circle"
      onClick={openBlankDocument}
      disabled={loadingBlankDocument}>
      <PencilSquare className="bi" />
      <span className="visually-hidden">New Document</span>
    </button>
  )
}

export default NewDocumentButton
