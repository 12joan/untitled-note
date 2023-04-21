import React from 'react'

import { useNewDocument } from '~/lib/useNewDocument'
import { useRenameTag } from '~/lib/useRenameTag'
import { Tag } from '~/lib/types'

import { DropdownItem } from '~/components/Dropdown'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import EditIcon from '~/components/icons/EditIcon'

export interface TagMenuProps {
  tag: Tag;
}

export const TagMenu = ({ tag }: TagMenuProps) => {
  const createNewDocument = useNewDocument()

  const {
    modal: renameTagModal,
    open: openRenameTagModal,
  } = useRenameTag(tag)

  return (
    <>
      <DropdownItem icon={NewDocumentIcon} onClick={() => createNewDocument({ tag })}>
        New document with tag
      </DropdownItem>

      <DropdownItem icon={EditIcon} onClick={openRenameTagModal}>
        Rename tag
      </DropdownItem>

      {renameTagModal}
    </>
  )
}
