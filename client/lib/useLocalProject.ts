import { updateProject } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { handleUpdateProjectError } from '~/lib/handleErrors';
import { useLocal } from '~/lib/useLocal';

export const useLocalProject = () => {
  const project = useAppContext('project');
  return useLocal(project, {
    update: updateProject,
    handleUpdateError: handleUpdateProjectError,
  });
};
