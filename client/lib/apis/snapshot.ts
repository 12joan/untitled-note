import { Snapshot } from '../types';

import { streamAction } from '~/channels/dataChannel';

export const streamSnapshots = (
  documentId: number,
  callback: (snapshots: Snapshot[]) => void
) =>
  streamAction(
    'Snapshot',
    'index',
    {
      document_id: documentId,
    },
    callback
  );
