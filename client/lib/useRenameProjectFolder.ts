import { updateProjectFolder } from '~/lib/apis/projectFolder';
import { handleUpdateProjectFolderError } from '~/lib/handleErrors';
import { ProjectFolder } from '~/lib/types';
import { useInputModal } from '~/lib/useInputModal';

export const useRenameProjectFolder = (folder: ProjectFolder) =>
  useInputModal({
    title: 'Rename folder',
    inputLabel: 'Folder name',
    inputPlaceholder: 'My folder',
    confirmLabel: 'Rename folder',
    initialValue: folder.name,
    autoSelect: true,
    onConfirm: (newName) =>
      handleUpdateProjectFolderError(
        updateProjectFolder(folder.id, {
          name: newName,
        })
      ),
  });
