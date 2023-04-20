import React from 'react'

import { DocumentLink } from '~/lib/routes'
import { makeDocumentDragData } from '~/lib/dragData'

import DocumentMenu from '~/components/DocumentMenu'
import ItemIndex from '~/components/ItemIndex'

const DocumentIndex = ({ documents, linkComponent = DocumentLink, ...otherProps }) => {
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
    dragData: makeDocumentDragData(doc),
  })

  return (
    <ItemIndex
      items={documents.map(itemForDocument)}
      cardPreviewHeight="40px" // 2 lines
      {...otherProps}
    />
  )
}

export default DocumentIndex
