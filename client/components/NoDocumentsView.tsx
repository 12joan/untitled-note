import React from 'react';
import { useNewDocument } from '~/lib/useNewDocument';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';

export const NoDocumentsView = () => {
  const createNewDocument = useNewDocument();

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5">
      <h3 className="text-xl font-medium select-none mb-1">No documents yet</h3>

      <p className="text-lg font-light select-none mb-3">
        Create a new document to get started
      </p>

      <button
        type="button"
        className="btn btn-rect btn-primary ring-offset-slate-100 dark:ring-offset-slate-800 flex gap-2 items-center"
        onClick={() => createNewDocument()}
      >
        <NewDocumentIcon size="1.25em" noAriaLabel />
        New document
      </button>
    </div>
  );
};
