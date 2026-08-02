import type { ReactNode } from 'react';
import type { TElement } from '~/lib/editor/plate';

export interface DocumentMention {
  documentId: number;
  fallbackText: string;
}

export interface MentionSuggestion {
  key: any;
  label: string;
  icon: ReactNode;
  onCommit: () => void;
}

export interface MentionElement extends TElement, DocumentMention {}
