import React from 'react';
import { Tag } from '~/lib/types';
import { useNewDocument } from '~/lib/useNewDocument';
import { useRenameTag } from '~/lib/useRenameTag';
import { DropdownItem } from '~/components/Dropdown';
import EditIcon from '~/components/icons/EditIcon';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';

export interface TagMenuProps {
  tag: Tag;
}

export const TagMenu = ({ tag }: TagMenuProps) => {
  const createNewDocument = useNewDocument();

  const { modal: renameTagModal, open: openRenameTagModal } = useRenameTag(tag);

  return (
    <>
      <DropdownItem
        icon={NewDocumentIcon}
        onClick={() => createNewDocument({ tag })}
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
