import { useNavigate, useLocation } from 'react-router-dom'

import useInputModal from '~/lib/useInputModal'
import { useContext } from '~/lib/context'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import { projectPath } from '~/lib/routes'
import awaitRedirect from '~/lib/awaitRedirect'
import { handleCreateProjectError } from '~/lib/handleErrors'

const useNewProject = () => {
  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()
  const { invalidateProjectsCache } = useContext()

  return useInputModal({
    title: 'New project',
    inputLabel: 'Project name',
    inputPlaceholder: 'My Project',
    confirmLabel: 'Create project',
    onConfirm: name => awaitRedirect({
      navigate,
      promisePath: handleCreateProjectError(
        ProjectsAPI.create({ name })
      ).then(({ id }) => {
        invalidateProjectsCache()
        return projectPath(id)
      }),
      fallbackPath: currentPath,
    }),
  })
}

export default useNewProject
