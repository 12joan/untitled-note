import React from 'react';
import {
  deleteDocument as deleteDocumentAPI,
  updateDocument as updateDocumentAPI,
} from '~/lib/apis/document';
import { useAppContext } from '~/lib/appContext';
import { copyText } from '~/lib/copyText';
import { TAB_OR_WINDOW } from '~/lib/environment';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import {
  handleDeleteDocumentError,
  handleUpdateDocumentError,
} from '~/lib/handleErrors';
import { DocumentLink, documentPath } from '~/lib/routes';
import { toggleDocumentPinned } from '~/lib/transformDocument';
import { Document, PartialDocument } from '~/lib/types';
import { useExportModal, UseExportModalOptions } from '~/lib/useExportModal';
import { useReplaceModal } from '~/lib/useReplaceModal';
import { DropdownItem } from '~/components/Dropdown';
import CopyIcon from '~/components/icons/CopyIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import DownloadIcon from '~/components/icons/DownloadIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import PinIcon from '~/components/icons/PinIcon';
import ReplaceIcon from '~/components/icons/ReplaceIcon';
import SearchIcon from '~/components/icons/SearchIcon';

export interface DocumentMenuProps {
  statusHeader?: React.ReactNode;
  document: PartialDocument;
  updateDocument?: (delta: Partial<Document>) => void;
  invalidateEditor?: boolean;
  openFind?: () => void;
  showReplace?: boolean;
  getEditorChildrenForExport?: UseExportModalOptions['getEditorChildren'];
}

export const DocumentMenu = ({
  statusHeader,
  document: doc,
  updateDocument: updateDocumentOverride,
  invalidateEditor = true,
  openFind,
  showReplace = false,
  getEditorChildrenForExport,
}: DocumentMenuProps) => {
  const projectId = useAppContext('projectId');

  const updateDocument =
    updateDocumentOverride ||
    ((delta) => {
      handleUpdateDocumentError(updateDocumentAPI(projectId, doc.id, delta));
    });

  const copyLink = () => {
    const path = documentPath({ projectId, documentId: doc.id });
    copyText(`${window.location.origin}${path}`);
  };

  const isPinned = doc.pinned_at !== null;
  const togglePinned = () =>
    updateDocument(toggleDocumentPinned(doc, { invalidateEditor }));

  const { modal: replaceModal, open: openReplaceModal } = useReplaceModal({
    documentId: doc.id,
  });

  const { modal: exportModal, open: openExportModal } = useExportModal({
    document: doc,
    getEditorChildren: getEditorChildrenForExport!,
  });

  const deleteDocument = () => {
    handleDeleteDocumentError(deleteDocumentAPI(projectId, doc.id));

    dispatchGlobalEvent('document:delete', { documentId: doc.id });
  };

  return (
    <>
      {statusHeader}

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

      {getEditorChildrenForExport && (
        <DropdownItem icon={DownloadIcon} onClick={() => openExportModal()}>
          Export document
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
      {exportModal}
    </>
  );
};
