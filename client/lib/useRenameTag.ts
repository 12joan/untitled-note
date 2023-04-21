import { useContext } from '~/lib/context';
import { handleRenameTagError } from '~/lib/handleErrors';
import { updateTag } from '~/lib/apis/tag';
import { useInputModal } from '~/lib/useInputModal';
import { Tag } from '~/lib/types';

export const useRenameTag = (tag: Tag) => {
  const { projectId } = useContext() as { projectId: number };

  return useInputModal({
    title: 'Rename tag',
    inputLabel: 'Tag name',
    inputPlaceholder: 'Enter new tag name',
    confirmLabel: 'Rename',
    initialValue: tag.text,
    autoSelect: true,
    onConfirm: (newText) => handleRenameTagError(
      updateTag(projectId, tag.id, {
        text: newText,
      }),
    ),
  });
};
