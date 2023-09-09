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
import { Future, mapFuture, unwrapFuture } from '~/lib/monads';
import { pluralize } from '~/lib/pluralize';
import { removeProjectFromHistory } from '~/lib/projectHistory';
import { Project } from '~/lib/types';
import { useModal } from '~/lib/useModal';
import { useOverrideable } from '~/lib/useOverrideable';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';
import { InlinePlaceholder } from '~/components/Placeholder';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';

export const ProjectActions = () => {
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

  const { modal: deleteModal, open: openDeleteModal } = useModal(
    (modalProps) => (
      <ConfirmDeletionModal
        {...modalProps}
        project={project}
        futureDocumentCount={futureDocumentCount}
        onConfirm={performDelete}
      />
    )
  );

  return (
    <div>
      {deleteModal}

      <h2 className="h2 select-none mb-3">Other actions</h2>

      <div className="border rounded-lg divide-y">
        <Action
          name={isArchived ? 'Unarchive this project' : 'Archive this project'}
          description="Archived projects appear in their own folder of the projects bar."
          buttonLabel={isArchived ? 'Unarchive project' : 'Archive project'}
          onClick={toggleArchived}
          inProgress={isTogglingArchived}
          spinnerAriaLabel={
            isArchived ? 'Unarchiving project' : 'Archiving project'
          }
        />

        <Action
          name="Delete this project"
          description="Deleting a project is permanent and cannot be undone."
          buttonLabel="Delete project"
          buttonClassName="text-red-500 dark:text-red-400"
          onClick={openDeleteModal}
        />
      </div>
    </div>
  );
};

interface ActionProps {
  name: string;
  description: string;
  buttonLabel: string;
  buttonClassName?: string;
  onClick: () => void;
  inProgress?: boolean;
  spinnerAriaLabel?: string;
}

const Action = ({
  name,
  description,
  buttonLabel,
  buttonClassName = '',
  onClick,
  inProgress = false,
  spinnerAriaLabel = '',
}: ActionProps) => {
  if (inProgress && spinnerAriaLabel === '') {
    throw new Error(
      'spinnerAriaLabel must be provided when inProgress is true'
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 sm:items-center">
      <div className="space-y-1 grow select-none">
        <strong className="font-medium">{name}</strong>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <button
        type="button"
        className={`shrink-0 relative btn btn-rect btn-secondary ${buttonClassName}`}
        onClick={onClick}
        disabled={inProgress}
      >
        <ReplaceWithSpinner
          isSpinner={inProgress}
          spinnerAriaLabel={spinnerAriaLabel}
        >
          {buttonLabel}
        </ReplaceWithSpinner>
      </button>
    </div>
  );
};

interface ConfirmDeletionModalProps extends Omit<StyledModalProps, 'children'> {
  project: Project;
  futureDocumentCount: Future<number>;
  onConfirm: () => void;
}

const ConfirmDeletionModal = ({
  open,
  onClose,
  project,
  futureDocumentCount,
  onConfirm,
}: ConfirmDeletionModalProps) => {
  const [areYouSure, setAreYouSure] = useState(false);

  return (
    <StyledModal open={open} onClose={onClose}>
      <div className="space-y-5">
        <ModalTitle>Delete project</ModalTitle>

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
            className="ring-offset-slate-100 dark:ring-offset-slate-800"
            checked={areYouSure}
            onChange={(event) => setAreYouSure(event.target.checked)}
          />

          <span className="select-none">
            I understand that this action is permanent and cannot be undone.
          </span>
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="btn btn-rect btn-modal-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-rect btn-danger"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            disabled={!areYouSure}
          >
            Delete project
          </button>
        </div>
      </div>
    </StyledModal>
  );
};
