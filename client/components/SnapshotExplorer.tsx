import React, { useLayoutEffect, useMemo } from 'react';
import { Value } from '@udecode/plate';
import { AppContextProvider } from '~/lib/appContext';
import { useEditorStyle } from '~/lib/editor/useEditorStyle';
import { Document, Snapshot } from '~/lib/types';
import { DiffViewer } from '~/components/DiffViewer';

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
    <div className="flex flex-wrap gap-5">
      <div className="space-y-3">
        {snapshotsAndCurrent.map((snapshot, index) => (
          <label key={snapshotKey(snapshot)} className="block">
            <input
              type="radio"
              name="snapshot"
              checked={index === viewingSnapshotIndex}
              onChange={() => setViewingSnapshotIndex(index)}
            />{' '}
            {snapshotName(snapshot)}
          </label>
        ))}
      </div>

      <AppContextProvider documentId={doc.id} editorStyle={editorStyle}>
        <DiffViewer
          previous={previousSnapshotBody}
          current={viewingSnapshotBody}
        />
      </AppContextProvider>
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
