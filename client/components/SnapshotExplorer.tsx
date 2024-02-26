import React, {
  FocusEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Value } from '@udecode/plate';
import { deleteSnapshot } from '~/lib/apis/snapshot';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { setLocalStorage, useLocalStorage } from '~/lib/browserStorage';
import { DiffViewer } from '~/lib/editor/diffViewer';
import { useEditorStyle } from '~/lib/editor/useEditorStyle';
import { getSnapshotDefaultName } from '~/lib/getSnapshotDefaultName';
import { handleDeleteSnapshotError } from '~/lib/handleErrors';
import {
  useNewSnapshotModal,
  useRenameSnapshotModal,
} from '~/lib/snapshotModals';
import { Document, Snapshot } from '~/lib/types';
import { Dropdown, DropdownItem } from '~/components/Dropdown';
import DeleteIcon from '~/components/icons/DeleteIcon';
import EditIcon from '~/components/icons/EditIcon';
import NewSnapshotIcon from '~/components/icons/NewSnapshotIcon';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import { RadioCard, RadioCardGroup } from '~/components/RadioCardGroup';
import { TippyInstance } from '~/components/Tippy';

export interface SnapshotExplorerProps {
  document: Document;
  snapshots: Snapshot[];
}

export const SnapshotExplorer = ({
  document: doc,
  snapshots,
}: SnapshotExplorerProps) => {
  const snapshotsAndCurrent = useMemo(
    () => ['current' as const, ...[...snapshots].reverse()],
    [snapshots]
  );

  const [unsafeViewingSnapshotIndex, setViewingSnapshotIndex] = useState(0);
  const viewingSnapshotIndex = Math.min(
    unsafeViewingSnapshotIndex,
    snapshotsAndCurrent.length - 1
  );

  useLayoutEffect(() => {
    if (viewingSnapshotIndex !== unsafeViewingSnapshotIndex) {
      setViewingSnapshotIndex(viewingSnapshotIndex);
    }
  }, [viewingSnapshotIndex]);

  const viewingSnapshotBody: Value = useMemo(() => {
    const snapshot = snapshotsAndCurrent[viewingSnapshotIndex];
    return JSON.parse(snapshot === 'current' ? doc.body : snapshot.body);
  }, [snapshotsAndCurrent, viewingSnapshotIndex, doc]);

  const previousSnapshotBody: Value | null = useMemo(() => {
    if (viewingSnapshotIndex === snapshotsAndCurrent.length - 1) {
      return null;
    }

    const snapshot = snapshotsAndCurrent[viewingSnapshotIndex + 1] as Snapshot;
    return JSON.parse(snapshot.body);
  }, [snapshotsAndCurrent, viewingSnapshotIndex]);

  const editorStyle = useEditorStyle(doc);

  const showDiff = useLocalStorage('showDiff', true);
  const setShowDiff = (showDiff: boolean) =>
    setLocalStorage('showDiff', showDiff);

  return (
    <>
      <div className="mb-5">
        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            className="ring-offset-plain-100 dark:ring-offset-plain-800"
            checked={showDiff}
            onChange={(e) => setShowDiff(e.target.checked)}
          />

          <span className="select-none">
            Highlight changes since the previous snapshot
          </span>
        </label>
      </div>

      <div className="grow flex gap-5 max-xl:flex-col">
        <div className="w-full xl:max-w-sm shrink-0">
          <RadioCardGroup
            value={viewingSnapshotIndex}
            onValueChange={setViewingSnapshotIndex}
          >
            {snapshotsAndCurrent.map((snapshot, index) => (
              <SnapshotRadioCard
                key={
                  snapshot === 'current' ? 'current' : snapshot.id.toString()
                }
                document={doc}
                snapshot={snapshot}
                index={index}
              />
            ))}
          </RadioCardGroup>
        </div>

        <div className="xl:w-narrow border rounded-lg p-5 overflow-x-hidden">
          <AppContextProvider documentId={doc.id} editorStyle={editorStyle}>
            <DiffViewer
              previous={previousSnapshotBody}
              current={viewingSnapshotBody}
              showDiff={showDiff}
            />
          </AppContextProvider>
        </div>
      </div>
    </>
  );
};

interface SnapshotRadioCardProps {
  document: Document;
  snapshot: Snapshot | 'current';
  index: number;
}

const SnapshotRadioCard = ({
  document: doc,
  snapshot,
  index,
}: SnapshotRadioCardProps) => {
  const afterRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuContainer = useRef<HTMLDivElement>(null);
  const tippyRef = useRef<TippyInstance>(null);

  const snapshotName =
    snapshot === 'current'
      ? 'Current version'
      : snapshot.name || getSnapshotDefaultName(snapshot);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const target = event.relatedTarget as Node;

    const targetOutsideScope = [afterRef, dropdownMenuContainer].every(
      (ref) => !ref.current!.contains(target)
    );

    if (targetOutsideScope) {
      tippyRef.current?.hide();
    }
  };

  const after = ({ checked }: { checked: boolean }) => (
    <button
      ref={afterRef}
      type="button"
      className="btn aspect-square p-2"
      tabIndex={checked ? 0 : -1}
      aria-label="Snapshot menu"
      onBlur={handleBlur}
    >
      <OverflowMenuIcon noAriaLabel />
    </button>
  );

  return (
    <>
      <RadioCard value={index} after={after}>
        {snapshotName}
      </RadioCard>

      <Dropdown
        tippyRef={tippyRef}
        reference={afterRef}
        items={
          <div className="contents" onBlur={handleBlur}>
            {snapshot === 'current' ? (
              <CurrentVersionMenu document={doc} />
            ) : (
              <SnapshotMenu snapshot={snapshot} />
            )}
          </div>
        }
        appendTo={dropdownMenuContainer.current!}
        placement="bottom-start"
        closeOnFocusOut={false}
      />

      <div ref={dropdownMenuContainer} />
    </>
  );
};

interface CurrentVersionMenuProps {
  document: Document;
}

const CurrentVersionMenu = ({ document: doc }: CurrentVersionMenuProps) => {
  const { modal, open: handleNewSnapshot } = useNewSnapshotModal({
    documentId: doc.id,
    showToastOnSuccess: false,
  });

  return (
    <>
      <DropdownItem icon={NewSnapshotIcon} onClick={handleNewSnapshot}>
        New snapshot
      </DropdownItem>

      {modal}
    </>
  );
};

interface SnapshotMenuProps {
  snapshot: Snapshot;
}

const SnapshotMenu = ({ snapshot }: SnapshotMenuProps) => {
  const projectId = useAppContext('projectId');

  const { modal, open: handleRenameSnapshot } = useRenameSnapshotModal({
    snapshot,
  });

  const handleDeleteSnapshot = () =>
    handleDeleteSnapshotError(
      deleteSnapshot(projectId, snapshot.document_id, snapshot.id)
    );

  return (
    <>
      <DropdownItem icon={EditIcon} onClick={handleRenameSnapshot}>
        Rename snapshot
      </DropdownItem>

      <DropdownItem
        icon={DeleteIcon}
        variant="danger"
        onClick={handleDeleteSnapshot}
      >
        Delete snapshot
      </DropdownItem>

      {modal}
    </>
  );
};