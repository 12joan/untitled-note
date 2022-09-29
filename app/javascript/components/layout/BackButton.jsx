import React from 'react'
import { CaretLeftFill } from 'react-bootstrap-icons'

import { useContext } from '~/lib/context'

import NavLink from '~/components/NavLink'

const BackButton = props => {
  const { tagId, documentId, tag } = useContext()

  const backButtonConfig = getBackButtonConfig({ tagId, documentId, tag })
    
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

const getBackButtonConfig = ({ tagId, documentId, tag }) => {
  const allDocumentsConfig = {
    label: 'All Documents',
    params: { tagId: undefined, documentId: undefined },
  }

  const tagConfig = {
    label: tag?.text,
    params: { tagId: tagId, documentId: undefined },
  }

  if (documentId === undefined) {
    if (tagId === undefined) {
      return null
    } else {
      return allDocumentsConfig
    }
  } else {
    if (tagId === undefined) {
      return allDocumentsConfig
    } else {
      return tagConfig
    }
  }
}

export default BackButton
