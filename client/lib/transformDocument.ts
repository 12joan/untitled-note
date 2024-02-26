import { Document } from '~/lib/types';

export interface TransformDocumentOptions {
  invalidateEditor?: boolean;
}

const transformDocument = (
  doc: Partial<Document>,
  delta: Partial<Document>,
  { invalidateEditor = true }: TransformDocumentOptions = {}
): Partial<Document> => ({
  id: doc.id,
  ...(invalidateEditor
    ? { updated_by: Math.random().toString(36).substring(2) }
    : {}),
  ...delta,
});

const createTimestampedProperty = (key: 'pinned_at' | 'locked_at') => {
  const enableProperty = (
    doc: Partial<Document>,
    options: TransformDocumentOptions = {}
  ) => transformDocument(doc, { [key]: new Date().toISOString() }, options);

  const disableProperty = (
    doc: Partial<Document>,
    options: TransformDocumentOptions = {}
  ) => transformDocument(doc, { [key]: null }, options);

  const toggleProperty = (
    doc: Partial<Document>,
    options: TransformDocumentOptions = {}
  ) =>
    doc[key] ? disableProperty(doc, options) : enableProperty(doc, options);

  return {
    enableProperty,
    disableProperty,
    toggleProperty,
  };
};

export const {
  enableProperty: pinDocument,
  disableProperty: unpinDocument,
  toggleProperty: toggleDocumentPinned,
} = createTimestampedProperty('pinned_at');

export const {
  enableProperty: lockDocument,
  disableProperty: unlockDocument,
  toggleProperty: toggleDocumentLocked,
} = createTimestampedProperty('locked_at');
