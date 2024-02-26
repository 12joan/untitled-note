import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSnapshot, updateSnapshot } from '~/lib/apis/snapshot';
import { useAppContext } from '~/lib/appContext';
import { getSnapshotDefaultName } from '~/lib/getSnapshotDefaultName';
import {
  handleCreateSnapshotError,
  handleUpdateSnapshotError,
} from '~/lib/handleErrors';
import { documentVersionHistoryPath } from '~/lib/routes';
import { createToast } from '~/lib/toasts';
import { Snapshot } from '~/lib/types';
import { useInputModal } from '~/lib/useInputModal';

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
          message: 'The snapshot has been created successfully',
          autoClose: 'slow',
          button: {
            label: 'Open version history',
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
