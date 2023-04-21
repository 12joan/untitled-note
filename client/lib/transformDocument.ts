import { Document } from './types';

export interface TransformDocumentOptions {
  invalidateEditor?: boolean;
}

const transformDocument = (
  doc: Partial<Document>,
  delta: Partial<Document>,
  {
    invalidateEditor = true,
  }: TransformDocumentOptions = {}
): Partial<Document> => ({
  id: doc.id,
  ...(invalidateEditor
    ? { updated_by: Math.random().toString(36).substring(2) }
    : {}),
  ...delta,
});

export const pinDocument = (
  doc: Partial<Document>,
  options: TransformDocumentOptions = {}
) => (
  transformDocument(
    doc,
    {
      pinned_at: new Date().toISOString(),
    },
    options
  )
);

export const unpinDocument = (
  doc: Partial<Document>,
  options: TransformDocumentOptions = {}
) => (
  transformDocument(
    doc,
    {
      pinned_at: null,
    },
    options
  )
)

export const toggleDocumentPinned = (
  doc: Partial<Document> & {
    pinned_at: Document['pinned_at'];
  },
  options: TransformDocumentOptions = {}
) => (
  doc.pinned_at
    ? unpinDocument(doc, options)
    : pinDocument(doc, options)
);
