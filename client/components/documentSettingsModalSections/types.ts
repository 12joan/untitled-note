import type { TDescendant } from '~/lib/editor/plate';
import type { Document } from '~/lib/types';

export interface DocumentSettingsModalSectionProps {
  document: Document;
  updateDocument: (delta: Partial<Document>) => void;
  getChildrenForExport: () => TDescendant[];
}
