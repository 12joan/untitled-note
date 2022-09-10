import React from 'react'
import { useContext } from '~/lib/context'

import ShowDocument from '~/components/documents/ShowDocument'
import DocumentIndex from '~/components/documents/DocumentIndex'

const ContentArea = props => {
  const { documentId } = useContext()

  if (documentId === undefined) {
    return <DocumentIndex />
  } else {
    return <ShowDocument id={documentId} />
  }
}

export default ContentArea
