import React from 'react';
import { NewDocumentLink } from '~/lib/routes';
import { Tag } from '~/lib/types';
import { useRenameTag } from '~/lib/useRenameTag';
import { DropdownItem } from '~/components/Dropdown';
import EditIcon from '~/components/icons/EditIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';

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
