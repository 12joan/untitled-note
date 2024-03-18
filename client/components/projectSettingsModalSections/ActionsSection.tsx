import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteProject, updateProject } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { awaitRedirect } from '~/lib/awaitRedirect';
import {
  handleArchiveProjectError,
  handleDeleteProjectError,
  handleUnarchiveProjectError,
} from '~/lib/handleErrors';
import { mapFuture, unwrapFuture } from '~/lib/monads';
import { pluralize } from '~/lib/pluralize';
import { removeProjectFromHistory } from '~/lib/projectHistory';
import { useOverrideable } from '~/lib/useOverrideable';
import { InlinePlaceholder } from '~/components/Placeholder';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';

export const ActionsSection = () => {
  const project = useAppContext('project');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');

  const futureDocumentCount = mapFuture(
    futurePartialDocuments,
    (xs) => xs.length
  );
  const [isArchived, overrideIsArchived] = useOverrideable(
    project.archived_at !== null
  );

  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

  const [isTogglingArchived, setIsTogglingArchived] = useState(false);
  const [areYouSureDelete, setAreYouSureDelete] = useState(false);

  const toggleArchived = () => {
    setIsTogglingArchived(true);

    const handleErrors = isArchived
      ? handleUnarchiveProjectError
      : handleArchiveProjectError;

    handleErrors(
      updateProject(project.id, {
        archived_at: isArchived ? null : new Date().toISOString(),
      }).then(() => overrideIsArchived(!isArchived))
    ).finally(() => setIsTogglingArchived(false));
  };

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
    <>
      <div className="space-y-2">
        <h4 className="h3 select-none">
          {isArchived ? 'Unarchive' : 'Archive'} project
        </h4>

        <p>Archived projects appear in their own folder of the projects bar.</p>

        <button
          type="button"
          className="relative btn btn-rect btn-modal-secondary"
          onClick={toggleArchived}
          disabled={isTogglingArchived}
        >
          <ReplaceWithSpinner
            isSpinner={isTogglingArchived}
            spinnerAriaLabel={
              isArchived ? 'Unarchiving project' : 'Archiving project'
            }
          >
            {isArchived ? 'Unarchive' : 'Archive'} project
          </ReplaceWithSpinner>
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="h3 select-none">Delete project</h4>

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
    </>
  );
};
