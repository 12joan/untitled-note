import { DropdownItem } from '~/components/Dropdown';
import EditIcon from '~/components/icons/EditIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import { NewDocumentLink } from '~/lib/routes';
import type { Tag } from '~/lib/types';
import { useRenameTag } from '~/lib/useRenameTag';

export interface TagMenuProps {
  tag: Tag;
}

export const TagMenu = ({ tag }: TagMenuProps) => {
  const { modal: renameTagModal, open: openRenameTagModal } = useRenameTag(tag);

  return (
    <>
      <DropdownItem
        icon={NewDocumentIcon}
        as={NewDocumentLink}
        to={{ tagId: tag.id }}
      >
        New document with tag
      </DropdownItem>

      <DropdownItem icon={EditIcon} onClick={openRenameTagModal}>
        Rename tag
      </DropdownItem>

      {renameTagModal}
    </>
  );
};
