import { Document, PartialDocument } from '~/lib/types';

export const isFullDocument = (
  doc: Document | PartialDocument
): doc is Document => 'body' in doc;
