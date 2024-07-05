import { ReactNode } from 'react';
import { TElement } from '~/lib/editor/plate';

export interface DocumentMention {
  documentId: number;
  fallbackText: string;
}

export type MentionSuggestion = {
  key: any;
  label: string;
  icon: ReactNode;
  onCommit: () => void;
};

export interface MentionElement extends TElement, DocumentMention {}
