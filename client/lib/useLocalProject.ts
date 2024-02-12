import { updateProject } from './apis/project';
import { useAppContext } from './appContext';
import { handleUpdateProjectError } from './handleErrors';
import { useLocal } from './useLocal';

export const useLocalProject = () => {
  const project = useAppContext('project');
  return useLocal(project, {
    update: updateProject,
    handleUpdateError: handleUpdateProjectError,
  });
};
