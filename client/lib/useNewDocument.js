import { useLocation, useNavigate } from 'react-router-dom';
import awaitRedirect from '~/lib/awaitRedirect';
import { useContext } from '~/lib/context';
import { handleCreateDocumentError } from '~/lib/handleErrors';
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI';
import { documentPath } from '~/lib/routes';

const useNewDocument = () => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const { projectId } = useContext();

  const createNewDocument = ({ tag } = {}) =>
    awaitRedirect({
      projectId,
      navigate,
      promisePath: handleCreateDocumentError(
        BlankDocumentAPI(projectId).create({ tag_id: tag?.id })
      ).then(({ id }) => documentPath(projectId, id)),
      fallbackPath: currentPath,
    });

  return createNewDocument;
};

export default useNewDocument;
