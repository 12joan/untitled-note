import React from 'react'

import FutureItemIndex from '~/components/FutureItemIndex'
import { DocumentLink } from '~/lib/routes'

import DocumentMenu from '~/components/DocumentMenu'

const FutureDocumentIndex = ({ futureDocuments, linkComponent = DocumentLink, ...otherProps }) => {
  const itemForDocument = doc => ({
    key: doc.id,
    label: doc.safe_title,
    preview: doc.preview,
    as: linkComponent,
    buttonProps: {
      documentId: doc.id,
    },
    contextMenu: (
      <DocumentMenu document={doc} />
    ),
  })

  return (
    <FutureItemIndex
      futureItems={futureDocuments.map(xs => xs.map(itemForDocument))}
      {...otherProps}
    />
  )
}

export default FutureDocumentIndex
