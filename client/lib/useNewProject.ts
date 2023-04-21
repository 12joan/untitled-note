import { useLocation, useNavigate } from 'react-router-dom';
import { createProject } from '~/lib/apis/project';
import { awaitRedirect } from '~/lib/awaitRedirect';
import { useContext } from '~/lib/context';
import { handleCreateProjectError } from '~/lib/handleErrors';
import { projectPath } from '~/lib/routes';
import { useInputModal } from '~/lib/useInputModal';

export const useNewProject = () => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

  const { invalidateProjectsCache } = useContext() as {
    invalidateProjectsCache: () => void;
  };

  return useInputModal({
    title: 'New project',
    inputLabel: 'Project name',
    inputPlaceholder: 'My Project',
    confirmLabel: 'Create project',
    onConfirm: (name) =>
      awaitRedirect({
        navigate,
        promisePath: handleCreateProjectError(createProject({ name })).then(
          ({ id }) => {
            invalidateProjectsCache();
            return projectPath({ projectId: id });
          }
        ),
        fallbackPath: currentPath,
      }),
  });
};
