import { TDescendant } from '@udecode/plate';
import { PartialDocument } from '~/lib/types';

export interface ExportModalSectionProps {
  document: PartialDocument;
  getEditorChildren: () => TDescendant[];
}
