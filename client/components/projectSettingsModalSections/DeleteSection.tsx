import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteProject /* updateProject */ } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { awaitRedirect } from '~/lib/awaitRedirect';
import { handleDeleteProjectError } from '~/lib/handleErrors';
import { mapFuture, unwrapFuture } from '~/lib/monads';
import { pluralize } from '~/lib/pluralize';
import { removeProjectFromHistory } from '~/lib/projectHistory';
import { InlinePlaceholder } from '~/components/Placeholder';

export const DeleteSection = () => {
  const project = useAppContext('project');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');

  const futureDocumentCount = mapFuture(
    futurePartialDocuments,
    (xs) => xs.length
  );

  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

  const [areYouSureDelete, setAreYouSureDelete] = useState(false);

  const performDelete = () =>
    awaitRedirect({
      navigate,
      promisePath: handleDeleteProjectError(deleteProject(project.id)).then(
        () => {
          removeProjectFromHistory(project.id);
          return '/';
        }
      ),
      fallbackPath: currentPath,
    });

  return (
    <div className="space-y-2">
      {unwrapFuture(futureDocumentCount, {
        pending: <InlinePlaceholder className="bg-white dark:bg-black" />,
        resolved: (documentCount) => (
          <p>
            <strong>{project.name}</strong> contains{' '}
            {pluralize(
              documentCount,
              'document, which will also be deleted',
              'documents, which will also be deleted',
              'no documents'
            )}
            .
          </p>
        ),
      })}

      <label className="flex gap-2 items-start">
        <input
          type="checkbox"
          className="ring-offset-plain-100 dark:ring-offset-plain-800"
          checked={areYouSureDelete}
          onChange={(event) => setAreYouSureDelete(event.target.checked)}
        />

        <span className="select-none">
          I understand that this action is permanent and cannot be undone.
        </span>
      </label>

      <button
        type="button"
        className="btn btn-rect btn-danger"
        disabled={!areYouSureDelete}
        onClick={performDelete}
      >
        Delete project
      </button>
    </div>
  );
};
