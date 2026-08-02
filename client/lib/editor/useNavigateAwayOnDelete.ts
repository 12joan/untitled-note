import { useNavigate } from 'react-router-dom';
import { useAppContext } from '~/lib/appContext';
import { useGlobalEvent } from '~/lib/globalEvents';
import { overviewPath } from '~/lib/routes';
import type { Document } from '~/lib/types';

export interface UseNavigateAwayOnDeleteOptions {
  documentId: Document['id'];
}

export const useNavigateAwayOnDelete = ({
  documentId,
}: UseNavigateAwayOnDeleteOptions) => {
  const projectId = useAppContext('projectId');
  const navigate = useNavigate();

  useGlobalEvent('document:delete', ({ documentId: deletedDocumentId }) => {
    if (deletedDocumentId === documentId) {
      void navigate(overviewPath({ projectId }));
    }
  });
};
