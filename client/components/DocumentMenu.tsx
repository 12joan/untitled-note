import React from 'react';
import {
  deleteDocument as deleteDocumentAPI,
  updateDocument as updateDocumentAPI,
} from '~/lib/apis/document';
import { useContext } from '~/lib/context';
import { copyPath } from '~/lib/copyPath';
import { TAB_OR_WINDOW } from '~/lib/environment';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import {
  handleDeleteDocumentError,
  handleUpdateDocumentError,
} from '~/lib/handleErrors';
import { DocumentLink, documentPath } from '~/lib/routes';
import { toggleDocumentPinned } from '~/lib/transformDocument';
import { Document, PartialDocument } from '~/lib/types';
import { useReplaceModal } from '~/lib/useReplaceModal';
import { DropdownItem } from '~/components/Dropdown';
import CopyIcon from '~/components/icons/CopyIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import PinIcon from '~/components/icons/PinIcon';
import ReplaceIcon from '~/components/icons/ReplaceIcon';
import SearchIcon from '~/components/icons/SearchIcon';

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
  const { projectId } = useContext() as { projectId: number };

  const updateDocument =
    updateDocumentOverride ||
    ((delta) => {
      handleUpdateDocumentError(updateDocumentAPI(projectId, doc.id, delta));
    });

  const copyLink = () =>
    copyPath(documentPath({ projectId, documentId: doc.id }));

  const isPinned = doc.pinned_at !== null;
  const togglePinned = () =>
    updateDocument(toggleDocumentPinned(doc, { invalidateEditor }));

  const { modal: replaceModal, open: openReplaceModal } = useReplaceModal({
    documentId: doc.id,
  });

  const deleteDocument = () => {
    handleDeleteDocumentError(deleteDocumentAPI(projectId, doc.id));

    dispatchGlobalEvent('document:delete', { documentId: doc.id });
  };

  return (
    <>
      <DropdownItem
        icon={OpenInNewTabIcon}
        as={DocumentLink}
        to={{ documentId: doc.id }}
        target="_blank"
      >
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
        <DropdownItem icon={ReplaceIcon} onClick={openReplaceModal}>
          Replace in document
        </DropdownItem>
      )}

      <DropdownItem
        icon={DeleteIcon}
        className="children:text-red-500 dark:children:text-red-400"
        onClick={deleteDocument}
      >
        Delete document
      </DropdownItem>

      {replaceModal}
    </>
  );
};
