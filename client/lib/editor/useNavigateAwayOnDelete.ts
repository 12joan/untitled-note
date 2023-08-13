import { useNavigate } from 'react-router-dom';
import { useContext } from '~/lib/context';
import { useGlobalEvent } from '~/lib/globalEvents';
import { overviewPath } from '~/lib/routes';
import { Document } from '~/lib/types';

export type UseNavigateAwayOnDeleteOptions = {
  documentId: Document['id'];
};

export const useNavigateAwayOnDelete = ({
  documentId,
}: UseNavigateAwayOnDeleteOptions) => {
  const { projectId } = useContext() as {
    projectId: number;
  };

  const navigate = useNavigate();

  useGlobalEvent('document:delete', ({ documentId: deletedDocumentId }) => {
    if (deletedDocumentId === documentId) {
      navigate(overviewPath({ projectId }));
    }
  });
};
