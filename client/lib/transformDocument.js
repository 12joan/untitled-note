const transformDocument = (doc, delta, { invalidateEditor = true } = {}) => ({
  id: doc.id,
  ...(invalidateEditor
    ? { updated_by: Math.random().toString(36).substring(2) }
    : {}),
  ...delta,
});

const pinDocument = (doc, options = {}) =>
  transformDocument(
    doc,
    {
      pinned_at: new Date().toISOString(),
    },
    options
  );

const unpinDocument = (doc, options = {}) =>
  transformDocument(
    doc,
    {
      pinned_at: null,
    },
    options
  );

const toggleDocumentPinned = (doc, options = {}) =>
  doc.pinned_at ? unpinDocument(doc, options) : pinDocument(doc, options);

export { pinDocument, unpinDocument, toggleDocumentPinned };
