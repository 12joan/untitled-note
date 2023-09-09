import { useNavigate } from 'react-router-dom';
import { useAppContext } from '~/lib/appContext';
import { useGlobalEvent } from '~/lib/globalEvents';
import { overviewPath } from '~/lib/routes';
import { Document } from '~/lib/types';

export type UseNavigateAwayOnDeleteOptions = {
  documentId: Document['id'];
};

export const useNavigateAwayOnDelete = ({
  documentId,
}: UseNavigateAwayOnDeleteOptions) => {
  const projectId = useAppContext('projectId');
  const navigate = useNavigate();

  useGlobalEvent('document:delete', ({ documentId: deletedDocumentId }) => {
    if (deletedDocumentId === documentId) {
      navigate(overviewPath({ projectId }));
    }
  });
};
