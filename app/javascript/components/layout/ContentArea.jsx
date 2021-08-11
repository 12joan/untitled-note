import React from 'react'

import { useContext } from 'lib/context'

import ShowDocument from 'components/documents/ShowDocument'
import DocumentIndex from 'components/documents/DocumentIndex'

const ContentArea = props => {
  const { view, documentId } = useContext()

  switch (view.type) {
    case 'index':
      return <DocumentIndex deletedOnly={view.deleted} />

    case 'show':
      return <ShowDocument id={documentId} />

    default:
      return null
  }
}

export default ContentArea
