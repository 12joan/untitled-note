import React from 'react'

import useNewDocument from '~/lib/useNewDocument'
import useRenameTag from '~/lib/useRenameTag'

import { DropdownItem } from '~/components/Dropdown'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import EditIcon from '~/components/icons/EditIcon'

const TagMenu = ({ tag }) => {
  const createNewDocument = useNewDocument()
  const [renameTagModal, openRenameTagModal] = useRenameTag()

  return (
    <>
      <DropdownItem icon={NewDocumentIcon} onClick={() => createNewDocument({ tag })}>
        New document with tag
      </DropdownItem>

      <DropdownItem icon={EditIcon} onClick={() => openRenameTagModal(tag)}>
        Rename tag
      </DropdownItem>

      {renameTagModal}
    </>
  )
}

export default TagMenu
