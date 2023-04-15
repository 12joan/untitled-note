import { useLocation, useNavigate } from 'react-router-dom';
import awaitRedirect from '~/lib/awaitRedirect';
import { useContext } from '~/lib/context';
import { handleCreateProjectError } from '~/lib/handleErrors';
import ProjectsAPI from '~/lib/resources/ProjectsAPI';
import { projectPath } from '~/lib/routes';
import useInputModal from '~/lib/useInputModal';

const useNewProject = () => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const { invalidateProjectsCache } = useContext();

  return useInputModal({
    title: 'New project',
    inputLabel: 'Project name',
    inputPlaceholder: 'My Project',
    confirmLabel: 'Create project',
    onConfirm: (name) =>
      awaitRedirect({
        navigate,
        promisePath: handleCreateProjectError(
          ProjectsAPI.create({ name })
        ).then(({ id }) => {
          invalidateProjectsCache();
          return projectPath(id);
        }),
        fallbackPath: currentPath,
      }),
  });
};

export default useNewProject;
