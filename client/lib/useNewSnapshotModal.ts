import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInputModal } from '~/lib/useInputModal';
import { createSnapshot } from './apis/snapshot';
import { useAppContext } from './appContext';
import { handleCreateSnapshotError } from './handleErrors';
import { documentVersionHistoryPath } from './routes';
import { createToast } from './toasts';

export interface UseNewSnapshotModalProps {
  documentId: number;
  showVersionHistoryLinkOnSuccess?: boolean;
}

export const useNewSnapshotModal = ({
  documentId,
  showVersionHistoryLinkOnSuccess = true,
}: UseNewSnapshotModalProps) => {
  const projectId = useAppContext('projectId');
  const navigate = useNavigate();

  const [inputPlaceholder] = useState(
    () => `Snapshot ${new Date().toLocaleString()}`
  );

  const handleSubmit = (name: string) => {
    const createPromise = createSnapshot(projectId, documentId, { name });

    handleCreateSnapshotError(createPromise).then(() =>
      createToast({
        title: 'Snapshot created',
        message: 'The snapshot has been created successfully',
        autoClose: 'slow',
        button: showVersionHistoryLinkOnSuccess
          ? {
              label: 'Open version history',
              onClick: () =>
                navigate(documentVersionHistoryPath({ projectId, documentId })),
            }
          : undefined,
      })
    );
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
