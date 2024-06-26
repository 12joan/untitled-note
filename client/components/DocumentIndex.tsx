import React, { ComponentType } from 'react';
import { makeDocumentDragData } from '~/lib/dragData';
import { DocumentLink } from '~/lib/routes';
import { PartialDocument } from '~/lib/types';
import { DocumentMenu } from '~/components/DocumentMenu';
import { Item, ItemIndex, ItemIndexProps } from '~/components/ItemIndex';

export interface DocumentIndexProps
  extends Omit<ItemIndexProps, 'items' | 'cardPreviewHeight'> {
  documents: PartialDocument[];
  linkComponent?: ComponentType<any>;
}

export const DocumentIndex = ({
  documents,
  linkComponent = DocumentLink,
  ...otherProps
}: DocumentIndexProps) => {
  const itemForDocument = (doc: PartialDocument): Item => {
    const formatDate = (date: string) => new Date(date).toLocaleString();

    return {
      key: doc.id,
      label: doc.safe_title,
      preview: doc.preview,
      as: linkComponent,
      buttonProps: {
        to: {
          documentId: doc.id,
        },
        title: `Modified ${formatDate(doc.updated_at)}\nCreated ${formatDate(
          doc.created_at
        )}`,
      },
      contextMenu: <DocumentMenu document={doc} />,
      dragData: makeDocumentDragData(doc),
    };
  };

  return (
    <ItemIndex
      items={documents.map(itemForDocument)}
      cardPreviewHeight="40px" // 2 lines
      {...otherProps}
    />
  );
};
