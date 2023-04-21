import React, { ComponentType } from 'react'

import { DocumentLink } from '~/lib/routes'
import { makeDocumentDragData } from '~/lib/dragData'
import { PartialDocument } from '~/lib/types'

import { DocumentMenu } from '~/components/DocumentMenu'
import { ItemIndex, ItemIndexProps, Item } from '~/components/ItemIndex'

export interface DocumentIndexProps extends Omit<ItemIndexProps, 'items' | 'cardPreviewHeight'> {
  documents: PartialDocument[]
  linkComponent?: ComponentType<any>
}

export const DocumentIndex = ({
  documents,
  linkComponent = DocumentLink,
  ...otherProps
}: DocumentIndexProps) => {
  const itemForDocument = (doc: PartialDocument): Item => ({
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
