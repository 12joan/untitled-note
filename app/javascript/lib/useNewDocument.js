import { useNavigate, useLocation } from 'react-router-dom'

import { useContext } from '~/lib/context'
import awaitRedirect from '~/lib/awaitRedirect'
import { handleCreateDocumentError } from '~/lib/handleErrors'
import BlankDocumentAPI from '~/lib/resources/BlankDocumentAPI'
import { documentPath } from '~/lib/routes'

const useNewDocument = () => {
  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()
  const { projectId } = useContext()

  const createNewDocument = () => awaitRedirect({
    projectId,
    navigate,
    promisePath: handleCreateDocumentError(
      BlankDocumentAPI(projectId).create()
    ).then(({ id }) => documentPath(projectId, id)),
    fallbackPath: currentPath,
  })

  return createNewDocument
}

export default useNewDocument
