import { TDescendant } from '@udecode/plate';
import { Document } from '~/lib/types';

export interface DocumentSettingsModalSectionProps {
  document: Document;
  updateDocument: (delta: Partial<Document>) => void;
  getChildrenForExport: () => TDescendant[];
}
