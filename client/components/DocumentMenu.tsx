import React from 'react'

import { useContext } from '~/lib/context'
import copyPath from '~/lib/copyPath'
import { DocumentLink, documentPath } from '~/lib/routes'
import { toggleDocumentPinned } from '~/lib/transformDocument'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { handleUpdateDocumentError, handleDeleteDocumentError } from '~/lib/handleErrors'
import useReplaceModal from '~/lib/useReplaceModal'
import { TAB_OR_WINDOW } from '~/lib/environment'
import { PartialDocument, Document } from '~/lib/types'

import { DropdownItem } from '~/components/Dropdown'
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon'
import CopyIcon from '~/components/icons/CopyIcon'
import PinIcon from '~/components/icons/PinIcon'
import SearchIcon from '~/components/icons/SearchIcon'
import ReplaceIcon from '~/components/icons/ReplaceIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

export interface DocumentMenuProps {
  document: PartialDocument;
  updateDocument?: (delta: Partial<Document>) => void;
  invalidateEditor?: boolean;
  openFind?: () => void;
  showReplace?: boolean;
}

export const DocumentMenu = ({
  document: doc,
  updateDocument: updateDocumentOverride,
  invalidateEditor = true,
  openFind = undefined,
  showReplace = false,
}: DocumentMenuProps) => {
  const { projectId } = useContext()
  const api = DocumentsAPI(projectId)

  const updateDocument = updateDocumentOverride || (delta => handleUpdateDocumentError(api.update({ id: doc.id, ...delta })))

  const copyLink = () => copyPath(documentPath(projectId, doc.id))

  const isPinned = doc.pinned_at !== null
  const togglePinned = () => updateDocument(toggleDocumentPinned(doc, { invalidateEditor }))

  const [replaceModal, openReplaceModal] = useReplaceModal()

  const deleteDocument = () => {
    handleDeleteDocumentError(api.destroy(doc))
    dispatchGlobalEvent('document:delete', { documentId: doc.id })
  }

  return (
    <>
      <DropdownItem icon={OpenInNewTabIcon} as={DocumentLink} documentId={doc.id} target="_blank">
        Open in new {TAB_OR_WINDOW}
      </DropdownItem>

      <DropdownItem icon={CopyIcon} onClick={copyLink}>
        Copy link
      </DropdownItem>

      <DropdownItem icon={PinIcon} onClick={togglePinned}>
        {isPinned ? 'Unpin' : 'Pin'} document
      </DropdownItem>

      {openFind && (
        <DropdownItem icon={SearchIcon} onClick={openFind}>
          Find in document
        </DropdownItem>
      )}

      {showReplace && (
        <DropdownItem icon={ReplaceIcon} onClick={() => openReplaceModal({ documentId: doc.id })}>
          Replace in document
        </DropdownItem>
      )}

      <DropdownItem icon={DeleteIcon} className="children:text-red-500 dark:children:text-red-400" onClick={deleteDocument}>
        Delete document
      </DropdownItem>

      {replaceModal}
    </>
  )
}
