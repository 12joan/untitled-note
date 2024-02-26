import { updateTag } from '~/lib/apis/tag';
import { useAppContext } from '~/lib/appContext';
import { handleRenameTagError } from '~/lib/handleErrors';
import { Tag } from '~/lib/types';
import { useInputModal } from '~/lib/useInputModal';

export const useRenameTag = (tag: Tag) => {
  const projectId = useAppContext('projectId');

  return useInputModal({
    title: 'Rename tag',
    inputLabel: 'Tag name',
    inputPlaceholder: 'Enter new tag name',
    confirmLabel: 'Rename tag',
    initialValue: tag.text,
    autoSelect: true,
    onConfirm: (newText) =>
      handleRenameTagError(
        updateTag(projectId, tag.id, {
          text: newText,
        })
      ),
  });
};
