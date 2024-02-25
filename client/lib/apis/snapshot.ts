import { fetchAPIEndpoint } from '../fetchAPIEndpoint';
import { Snapshot } from '../types';

import { streamAction } from '~/channels/dataChannel';

export const createSnapshot = (
  projectId: number,
  documentId: number,
  { name }: { name: string }
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: `/api/v1/projects/${projectId}/documents/${documentId}/snapshots`,
    data: {
      snapshot: {
        name,
      },
    },
  }).then((response) => response.json()) as Promise<Snapshot>;

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
