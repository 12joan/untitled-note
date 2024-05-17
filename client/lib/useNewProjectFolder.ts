import { createProjectFolder } from '~/lib/apis/projectFolder';
import { handleCreateProjectFolderError } from '~/lib/handleErrors';
import { useInputModal } from '~/lib/useInputModal';

export const useNewProjectFolder = () =>
  useInputModal({
    title: 'New folder',
    inputLabel: 'Folder name',
    inputPlaceholder: 'My folder',
    confirmLabel: 'Rename folder',
    onConfirm: (name) =>
      handleCreateProjectFolderError(
        createProjectFolder({
          name,
        })
      ),
  });
