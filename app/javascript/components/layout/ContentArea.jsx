import React from 'react'

import { useContext } from 'lib/context'

import NewDocument from 'components/documents/NewDocument'
import ShowDocument from 'components/documents/ShowDocument'
import DocumentIndex from 'components/documents/DocumentIndex'

const ContentArea = props => {
  const { documentId } = useContext()

  switch (documentId) {
    case undefined:
      return <DocumentIndex />

    case 'new':
      return <NewDocument />

    default:
      return <ShowDocument id={documentId} />
  }
}

export default ContentArea
