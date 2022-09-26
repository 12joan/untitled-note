import React from 'react'

import { useContext } from '~/lib/context'
import copyPath from '~/lib/copyPath'
import { DocumentLink, documentPath } from '~/lib/routes'
import { toggleDocumentPinned } from '~/lib/transformDocument'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { handleUpdateDocumentError, handleDeleteDocumentError } from '~/lib/handleErrors'

import { DropdownItem } from '~/components/Dropdown'
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon'
import CopyIcon from '~/components/icons/CopyIcon'
import PinIcon from '~/components/icons/PinIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const DocumentMenu = ({ document: doc, updateDocument: updateDocumentOverride, incrementRemoteVersion = true }) => {
  const { projectId } = useContext()
  const api = DocumentsAPI(projectId)

  const updateDocument = updateDocumentOverride || (delta => handleUpdateDocumentError(api.update({ id: doc.id, ...delta })))

  const copyLink = () => copyPath(documentPath(projectId, doc.id))

  const isPinned = doc.pinned_at !== null
  const togglePinned = () => updateDocument(toggleDocumentPinned(doc, { incrementRemoteVersion }))

  const deleteDocument = () => {
    handleDeleteDocumentError(api.destroy(doc))
    dispatchGlobalEvent('document:delete', { documentId: doc.id })
  }

  return (
    <>
      <DropdownItem icon={OpenInNewTabIcon} as={DocumentLink} documentId={doc.id} target="_blank">
        Open in new tab
      </DropdownItem>

      <DropdownItem icon={CopyIcon} onClick={copyLink}>
        Copy link
      </DropdownItem>

      <DropdownItem icon={PinIcon} onClick={togglePinned}>
        {isPinned ? 'Unpin' : 'Pin'} document
      </DropdownItem>

      <DropdownItem icon={DeleteIcon} className="children:text-red-500 dark:children:text-red-500" onClick={deleteDocument}>
        Delete document
      </DropdownItem>
    </>
  )
}

export default DocumentMenu
