import { useLocation, useNavigate } from 'react-router-dom';
import { createProject } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { awaitRedirect } from '~/lib/awaitRedirect';
import { handleCreateProjectError } from '~/lib/handleErrors';
import { projectPath } from '~/lib/routes';
import { ProjectFolder } from '~/lib/types';
import { useInputModal } from '~/lib/useInputModal';

export interface UseNewProjectOptions {
  folder?: ProjectFolder;
}

export const useNewProject = ({ folder }: UseNewProjectOptions = {}) => {
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();
  const invalidateProjectsCache = useAppContext('invalidateProjectsCache');

  const handleConfirm = async (name: string): Promise<string> =>
    handleCreateProjectError(
      createProject({ name, folder_id: folder?.id })
    ).then(({ id }) => {
      invalidateProjectsCache();
      return projectPath({ projectId: id });
    });

  return useInputModal({
    title: folder ? `New project in ${folder.name}` : 'New project',
    inputLabel: 'Project name',
    inputPlaceholder: 'My Project',
    confirmLabel: 'Create project',
    onConfirm: (name) =>
      awaitRedirect({
        navigate,
        promisePath: handleConfirm(name),
        fallbackPath: currentPath,
      }),
  });
};
