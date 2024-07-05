/**
 * When a document has just been created using the mention combobox, the
 * mention element won't have access to its data via partialDocuments yet.
 * Store the IDs of all such documents here to prevent the mention element from
 * showing the document as deleted.
 */
export const justCreatedIds = new Set<number>();
