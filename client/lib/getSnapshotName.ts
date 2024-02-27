import { Snapshot } from '~/lib/types';

const getSnapshotTimestampName = (
  snapshot: Pick<Snapshot, 'created_at'>
): string => `Snapshot ${new Date(snapshot.created_at).toLocaleString()}`;

const getSnapshotBeforeRestoreName = (
  beforeRestore: Exclude<Snapshot['before_restore'], null>
): string => {
  if (beforeRestore.name) return beforeRestore.name;
  if (beforeRestore.is_unrestore) return 'Before restoring ...';
  return getSnapshotTimestampName(beforeRestore);
};

export const getSnapshotDefaultName = (
  snapshot: Pick<Snapshot, 'created_at' | 'before_restore'>
): string => {
  if (snapshot.before_restore) {
    const beforeRestoreName = getSnapshotBeforeRestoreName(
      snapshot.before_restore
    );
    return `Before restoring "${beforeRestoreName}"`;
  }

  return getSnapshotTimestampName(snapshot);
};

export const getSnapshotName = (
  snapshot: Pick<Snapshot, 'name' | 'created_at' | 'before_restore'>
): string => snapshot.name || getSnapshotDefaultName(snapshot);
