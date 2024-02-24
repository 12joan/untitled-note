import React, { useLayoutEffect, useMemo } from 'react';
import { Value } from '@udecode/plate';
import { AppContextProvider } from '~/lib/appContext';
import { useEditorStyle } from '~/lib/editor/useEditorStyle';
import { Document, Snapshot } from '~/lib/types';
import { DiffViewer } from '~/components/DiffViewer';
import {RadioCard, RadioCardGroup} from './RadioCardGroup';

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

  const [unsafeViewingSnapshotIndex, setViewingSnapshotIndex] =
    React.useState(0);
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

  return (
    <div className="flex gap-5 max-xl:flex-col">
      <div className="w-full xl:max-w-xs shrink-0">
        <RadioCardGroup>
          {snapshotsAndCurrent.map((snapshot, index) => (
            <RadioCard
              key={snapshotKey(snapshot)}
              name="snapshot"
              checked={index === viewingSnapshotIndex}
              onCheck={() => setViewingSnapshotIndex(index)}
            >
              {snapshotName(snapshot)}
            </RadioCard>
          ))}
        </RadioCardGroup>
      </div>

      <div className="xl:w-narrow border rounded-lg p-5 overflow-x-hidden">
        <AppContextProvider documentId={doc.id} editorStyle={editorStyle}>
          <DiffViewer
            previous={previousSnapshotBody}
            current={viewingSnapshotBody}
          />
        </AppContextProvider>
      </div>
    </div>
  );
};

const snapshotKey = (snapshot: Snapshot | 'current'): string =>
  snapshot === 'current' ? 'current' : snapshot.id.toString();

const snapshotName = (snapshot: Snapshot | 'current'): string =>
  snapshot === 'current'
    ? 'Current version'
    : snapshot.name ||
      `Snapshot ${new Date(snapshot.created_at).toLocaleString()}`;
