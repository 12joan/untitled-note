import { Snapshot } from '~/lib/types';

export const getSnapshotName = (snapshot: Snapshot): string =>
  snapshot.name || getSnapshotDefaultName(snapshot);

export const getSnapshotDefaultName = (snapshot: Snapshot): string =>
  getRestoresSnapshotName(snapshot) || getSnapshotTimestampName(snapshot);

const getRestoresSnapshotName = (snapshot: Snapshot): string | null =>
  snapshot.restores_snapshot &&
  `Restore "${getSnapshotName(snapshot.restores_snapshot)}"`;

const getSnapshotTimestampName = (snapshot: Snapshot): string =>
  `Snapshot ${new Date(snapshot.created_at).toLocaleString()}`;
