import { useLocation, useNavigate } from 'react-router-dom';
import { awaitRedirect } from '~/lib/awaitRedirect';
import { useContext } from '~/lib/context';
import { handleCreateDocumentError } from '~/lib/handleErrors';
import { documentPath } from '~/lib/routes';
import { createBlankDocument } from '~/lib/apis/document';
import { Tag } from '~/lib/types';

export const useNewDocument = () => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const { projectId } = useContext() as { projectId: number };

  const createNewDocument = ({ tag }: {
    tag?: Tag
  } = {}) => (
    awaitRedirect({
      projectId,
      navigate,
      promisePath: handleCreateDocumentError(
        createBlankDocument(projectId, { tagId: tag?.id })
      ).then(({ id }) => documentPath({ projectId, documentId: id })),
      fallbackPath: currentPath,
    })
  );

  return createNewDocument;
};
