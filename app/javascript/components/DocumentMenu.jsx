import React from 'react'

import { useContext } from '~/lib/context'
import { DocumentLink } from '~/lib/routes'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'

import { DropdownItem } from '~/components/Dropdown'
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon'
import CopyIcon from '~/components/icons/CopyIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const DocumentMenu = ({ document: doc, onDelete }) => {
  const { projectId } = useContext()

  return (
    <>
      <DropdownItem
        icon={OpenInNewTabIcon}
        as={DocumentLink}
        documentId={doc.id}
        target="_blank"
      >
        Open in new tab
      </DropdownItem>

      <DropdownItem
        icon={CopyIcon}
        onClick={() => alert('Not implemented yet')}
      >
        Copy link
      </DropdownItem>

      <DropdownItem
        icon={DeleteIcon}
        className="children:text-red-500 dark:children:text-red-500"
        onClick={() => {
          DocumentsAPI(projectId).destroy(doc)
          onDelete?.()
        }}
      >
        Delete
      </DropdownItem>
    </>
  )
}

export default DocumentMenu
