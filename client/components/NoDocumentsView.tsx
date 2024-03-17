import React from 'react';
import { NewDocumentRectButton } from '~/components/NewDocumentRectButton';

export const NoDocumentsView = () => {
  return (
    <div className="bg-plain-100 dark:bg-plain-800 rounded-lg p-5">
      <h3 className="text-xl font-medium select-none mb-1">No documents yet</h3>

      <p className="text-lg font-light select-none mb-3">
        Create a new document to get started
      </p>

      <p>
        <NewDocumentRectButton className="ring-offset-plain-100 dark:ring-offset-plain-800" />
      </p>
    </div>
  );
};
