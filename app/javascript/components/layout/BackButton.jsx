import React from 'react'
import { CaretLeftFill } from 'react-bootstrap-icons'

import { useContext } from '~/lib/context'

import NavLink from '~/components/NavLink'

const BackButton = props => {
  const { keywordId, documentId, keyword } = useContext()

  const backButtonConfig = getBackButtonConfig({ keywordId, documentId, keyword })
    
  if (backButtonConfig === null) {
    return null
  }

  return (
    <NavLink
      id="back-button"
      className="text-decoration-none"
      params={backButtonConfig.params}>
      <CaretLeftFill className="bi" /> {backButtonConfig.label}
    </NavLink>
  )
}

const getBackButtonConfig = ({ keywordId, documentId, keyword }) => {
  const allDocumentsConfig = {
    label: 'All Documents',
    params: { keywordId: undefined, documentId: undefined },
  }

  const keywordConfig = {
    label: keyword?.text,
    params: { keywordId: keywordId, documentId: undefined },
  }

  if (documentId === undefined) {
    if (keywordId === undefined) {
      return null
    } else {
      return allDocumentsConfig
    }
  } else {
    if (keywordId === undefined) {
      return allDocumentsConfig
    } else {
      return keywordConfig
    }
  }
}

export default BackButton
