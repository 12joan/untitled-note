const transformDocument = (doc, delta, { incrementRemoteVersion = true } = {}) => ({
  id: doc.id,
  ...(incrementRemoteVersion ? { remote_version: doc.remote_version + 1 } : {}),
  ...delta,
})

const pinDocument = (doc, options = {}) => transformDocument(doc, {
  pinned_at: new Date().toISOString(),
}, options)

const unpinDocument = (doc, options = {}) => transformDocument(doc, {
  pinned_at: null,
}, options)

const toggleDocumentPinned = (doc, options = {}) => doc.pinned_at
  ? unpinDocument(doc, options)
  : pinDocument(doc, options)

export {
  pinDocument,
  unpinDocument,
  toggleDocumentPinned,
}
