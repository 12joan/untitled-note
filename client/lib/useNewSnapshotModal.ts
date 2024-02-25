import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useInputModal } from '~/lib/useInputModal';
import {useAppContext} from './appContext';
import {createSnapshot} from './apis/snapshot';
import {createToast} from './toasts';
import {handleCreateSnapshotError} from './handleErrors';
import {documentVersionHistoryPath} from './routes';

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

  const [initialName] = useState(() => {
    const date = new Date();
    return `Snapshot ${date.toLocaleString()}`;
  });

  const handleSubmit = (name: string) => {
    const createPromise = createSnapshot(projectId, documentId, { name });

    handleCreateSnapshotError(createPromise).then(() =>
      createToast({
        title: 'Snapshot created',
        message: 'The snapshot has been created successfully',
        autoClose: 'slow',
        button: showVersionHistoryLinkOnSuccess ? {
          label: 'Open version history',
          onClick: () => navigate(documentVersionHistoryPath({ projectId, documentId })),
        } : undefined,
      })
    );
  };

  return useInputModal({
    title: 'New snapshot',
    inputLabel: 'Snapshot name',
    inputPlaceholder: initialName,
    initialValue: initialName,
    normalizeInput: (name) => name.trim() || initialName,
    autoSelect: true,
    confirmLabel: 'Create snapshot',
    onConfirm: handleSubmit,
  });
};
