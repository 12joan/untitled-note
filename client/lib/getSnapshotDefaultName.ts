import { Snapshot } from '~/lib/types';

export const getSnapshotDefaultName = ({ created_at: createdAt }: Snapshot) =>
  `Snapshot ${new Date(createdAt).toLocaleString()}`;
