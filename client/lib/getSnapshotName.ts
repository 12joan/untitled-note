import { Snapshot } from '~/lib/types';

export const getSnapshotName = (snapshot: Snapshot): string =>
  snapshot.name || getSnapshotDefaultName(snapshot);

export const getSnapshotDefaultName = (snapshot: Snapshot): string =>
  getRestoresSnapshotName(snapshot) || getSnapshotTimestampName(snapshot);

const getRestoresSnapshotName = (snapshot: Snapshot): string | null =>
  snapshot.restores_snapshot &&
  `Restore "${getSnapshotName(snapshot.restores_snapshot)}"`;

const getSnapshotTimestampName = (snapshot: Snapshot): string => {
  const noun = snapshot.manual ? 'Snapshot' : 'Auto-snapshot';
  const date = new Date(snapshot.created_at).toLocaleString();
  return `${noun} ${date}`;
};
