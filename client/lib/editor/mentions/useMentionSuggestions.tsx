import React, { useMemo } from 'react';
import { useAppContext } from '~/lib/appContext';
import { filterPredicate } from '~/lib/filterPredicate';
import { orDefaultFuture } from '~/lib/monads';
import DeleteIcon from '~/components/icons/DeleteIcon';
import DocumentIcon from '~/components/icons/DocumentIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import { DocumentMention, MentionSuggestion } from './types';

export interface UseMentionSuggestionsOptions {
  query: string;
  onSelectItem: (item: DocumentMention) => void;
  onCreateDocument: () => void;
  onCancel: () => void;
}

export const useMentionSuggestions = ({
  query,
  onSelectItem: handleSelectItem,
  onCreateDocument: handleCreateDocument,
  onCancel: handleCancel,
}: UseMentionSuggestionsOptions): MentionSuggestion[] => {
  const futurePartialDocuments = useAppContext('futurePartialDocuments');

  const matchingDocuments = useMemo(
    () =>
      orDefaultFuture(futurePartialDocuments, [])
        .filter((doc) => doc.title && filterPredicate(doc.title, query))
        .sort((a, b) => a.title!.length - b.title!.length),
    [futurePartialDocuments, query]
  );

  return useMemo(
    () =>
      [
        ...matchingDocuments.map((doc) => ({
          enabled: true,
          key: doc.id,
          label: doc.title!,
          icon: (
            <DocumentIcon
              size="1.25em"
              noAriaLabel
              className="text-primary-500 dark:text-primary-400 data-active:text-white"
            />
          ),
          onCommit: () =>
            handleSelectItem({
              documentId: doc.id,
              fallbackText: doc.safe_title,
            }),
        })),

        {
          enabled: query.length > 0,
          key: 'create',
          icon: (
            <NewDocumentIcon
              size="1.25em"
              noAriaLabel
              className="text-primary-500 dark:text-primary-400 data-active:text-white"
            />
          ),
          label: `Create "${query}"`,
          onCommit: handleCreateDocument,
        },

        {
          enabled: true,
          key: 'cancel',
          icon: (
            <DeleteIcon
              size="1.25em"
              noAriaLabel
              className="text-red-500 dark:text-red-400 data-active:text-white"
            />
          ),
          label: 'Cancel mention',
          onCommit: handleCancel,
        },
      ].filter((s) => s.enabled),
    [matchingDocuments, query, handleSelectItem, handleCreateDocument]
  );
};
