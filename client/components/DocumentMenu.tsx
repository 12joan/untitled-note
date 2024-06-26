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
import { isFullDocument } from '~/lib/isFullDocument';
import {
  DocumentLink,
  documentPath,
  DocumentVersionHistoryLink,
} from '~/lib/routes';
import { useNewSnapshotModal } from '~/lib/snapshotModals';
import {
  toggleDocumentLocked,
  toggleDocumentPinned,
} from '~/lib/transformDocument';
import { Document, PartialDocument } from '~/lib/types';
import {
  useDocumentSettingsModal,
  UseDocumentSettingsModalOptions,
} from '~/lib/useDocumentSettingsModal';
import { useReplaceModal } from '~/lib/useReplaceModal';
import { DropdownItem } from '~/components/Dropdown';
import CopyIcon from '~/components/icons/CopyIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import LockIcon from '~/components/icons/LockIcon';
import NewSnapshotIcon from '~/components/icons/NewSnapshotIcon';
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon';
import PinIcon from '~/components/icons/PinIcon';
import ReplaceIcon from '~/components/icons/ReplaceIcon';
import SearchIcon from '~/components/icons/SearchIcon';
import SettingsIcon from '~/components/icons/SettingsIcon';
import VersionHistoryIcon from '~/components/icons/VersionHistoryIcon';

export interface DocumentMenuProps {
  isEditor?: boolean;
  statusHeader?: React.ReactNode;
  document: PartialDocument | Document;
  updateDocument?: (delta: Partial<Document>) => void;
  invalidateEditor?: boolean;
  openFind?: () => void;
  getChildrenForExport?: UseDocumentSettingsModalOptions['getChildrenForExport'];
}

export const DocumentMenu = ({
  isEditor = false,
  statusHeader,
  document: doc,
  updateDocument: updateDocumentOverride,
  invalidateEditor = true,
  openFind,
  getChildrenForExport,
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

  const versionHistoryAvailable = doc.body_type === 'json/slate';

  const { modal: newSnapshotModal, open: openNewSnapshotModal } =
    useNewSnapshotModal({
      documentId: doc.id,
    });

  const isLocked = doc.locked_at !== null;
  const toggleLocked = () =>
    updateDocument(toggleDocumentLocked(doc, { invalidateEditor }));

  const { modal: replaceModal, open: openReplaceModal } = useReplaceModal({
    documentId: doc.id,
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

      {isEditor && (
        <DropdownItem icon={ReplaceIcon} onClick={openReplaceModal}>
          Replace in document
        </DropdownItem>
      )}

      {versionHistoryAvailable && (
        <>
          <DropdownItem
            icon={VersionHistoryIcon}
            as={DocumentVersionHistoryLink}
            to={{ documentId: doc.id }}
          >
            Version history
          </DropdownItem>

          <DropdownItem icon={NewSnapshotIcon} onClick={openNewSnapshotModal}>
            New snapshot
          </DropdownItem>
        </>
      )}

      <DropdownItem icon={LockIcon} onClick={toggleLocked}>
        {isLocked ? 'Unlock' : 'Lock'} document
      </DropdownItem>

      {isFullDocument(doc) && updateDocument && getChildrenForExport && (
        <DocumentSettingsMenuItem
          document={doc}
          updateDocument={updateDocument}
          getChildrenForExport={getChildrenForExport}
        />
      )}

      <DropdownItem icon={DeleteIcon} variant="danger" onClick={deleteDocument}>
        Delete document
      </DropdownItem>

      {replaceModal}
      {newSnapshotModal}
    </>
  );
};

const DocumentSettingsMenuItem = (options: UseDocumentSettingsModalOptions) => {
  const { modal, open } = useDocumentSettingsModal(options);

  return (
    <>
      <DropdownItem icon={SettingsIcon} onClick={() => open()}>
        Document settings
      </DropdownItem>

      {modal}
    </>
  );
};
