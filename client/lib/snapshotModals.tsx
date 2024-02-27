import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createSnapshot,
  restoreSnapshot,
  updateSnapshot,
} from '~/lib/apis/snapshot';
import { useAppContext } from '~/lib/appContext';
import { getSnapshotDefaultName } from '~/lib/getSnapshotName';
import {
  handleCreateSnapshotError,
  handleRestoreSnapshotError,
  handleUpdateSnapshotError,
} from '~/lib/handleErrors';
import { documentVersionHistoryPath } from '~/lib/routes';
import { createToast } from '~/lib/toasts';
import { Snapshot } from '~/lib/types';
import { useInputModal } from '~/lib/useInputModal';
import { useModal } from '~/lib/useModal';
import { ModalTitle, StyledModal, StyledModalProps } from '~/components/Modal';

export interface UseNewSnapshotModalProps {
  documentId: number;
  showToastOnSuccess?: boolean;
}

export const useNewSnapshotModal = ({
  documentId,
  showToastOnSuccess = true,
}: UseNewSnapshotModalProps) => {
  const projectId = useAppContext('projectId');
  const navigate = useNavigate();

  const [inputPlaceholder] = useState(
    () => `Snapshot ${new Date().toLocaleString()}`
  );

  const handleSubmit = (name: string) => {
    const createPromise = createSnapshot(projectId, documentId, { name });

    handleCreateSnapshotError(createPromise).then(() => {
      if (showToastOnSuccess) {
        createToast({
          title: 'Snapshot created',
          message: 'The current version of the document has been saved.',
          autoClose: 'fast',
          button: {
            label: 'Version history',
            onClick: () =>
              navigate(documentVersionHistoryPath({ projectId, documentId })),
          },
        });
      }
    });
  };

  return useInputModal({
    title: 'New snapshot',
    inputLabel: 'Snapshot name (optional)',
    inputPlaceholder,
    required: false,
    autoSelect: true,
    confirmLabel: 'Create snapshot',
    onConfirm: handleSubmit,
  });
};

export interface UseRenameSnapshotModalProps {
  snapshot: Snapshot;
}

export const useRenameSnapshotModal = ({
  snapshot,
}: UseRenameSnapshotModalProps) => {
  const projectId = useAppContext('projectId');

  const handleSubmit = (name: string) => {
    if (name === snapshot.name) return;
    handleUpdateSnapshotError(
      updateSnapshot(projectId, snapshot.document_id, snapshot.id, { name })
    );
  };

  return useInputModal({
    title: 'Rename snapshot',
    inputLabel: 'Snapshot name (optional)',
    initialValue: snapshot.name,
    inputPlaceholder: getSnapshotDefaultName(snapshot),
    required: false,
    autoSelect: true,
    confirmLabel: 'Rename snapshot',
    onConfirm: handleSubmit,
  });
};

export interface UseRestoreSnapshotModalProps {
  snapshot: Snapshot;
}

export const useRestoreSnapshotModal = ({
  snapshot,
}: UseRestoreSnapshotModalProps) => {
  const projectId = useAppContext('projectId');

  const handleSubmit = (saveCurrent: boolean) => {
    handleRestoreSnapshotError(
      restoreSnapshot(projectId, snapshot.document_id, snapshot.id, {
        saveCurrent,
      })
    ).then(() =>
      createToast({
        title: 'Snapshot restored',
        message: 'The document has been restored to the selected snapshot.',
        autoClose: 'fast',
      })
    );
  };

  return useModal((modalProps) => (
    <RestoreSnapshotModal {...modalProps} onConfirm={handleSubmit} />
  ));
};

const RestoreSnapshotModal = ({
  open,
  onClose,
  onConfirm,
}: Omit<StyledModalProps, 'children'> & {
  onConfirm: (saveCurrent: boolean) => void;
}) => {
  const [saveCurrent, setSaveCurrent] = useState(true);

  return (
    <StyledModal open={open} onClose={onClose}>
      <div className="space-y-5">
        <ModalTitle>Restore snapshot</ModalTitle>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            className="ring-offset-plain-100 dark:ring-offset-plain-800"
            checked={saveCurrent}
            onChange={(event) => setSaveCurrent(event.target.checked)}
          />

          <span className="select-none">
            Save the current version of the document as a new snapshot
            (recommended)
          </span>
        </label>

        {!saveCurrent && (
          <p className="text-red-500 dark:text-red-400 font-medium">
            <strong>Warning:</strong> The current version of the document will
            be permanently lost.
          </p>
        )}

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
            className="btn btn-rect btn-primary"
            onClick={() => {
              onClose();
              onConfirm(saveCurrent);
            }}
          >
            Restore snapshot
          </button>
        </div>
      </div>
    </StyledModal>
  );
};
