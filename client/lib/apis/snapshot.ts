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

export const updateSnapshot = (
  projectId: number,
  documentId: number,
  id: number,
  { name }: { name: string }
) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}/documents/${documentId}/snapshots/${id}`,
    data: {
      snapshot: {
        name,
      },
    },
  }).then((response) => response.json()) as Promise<Snapshot>;

export const deleteSnapshot = (
  projectId: number,
  documentId: number,
  id: number
) =>
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/projects/${projectId}/documents/${documentId}/snapshots/${id}`,
  });

export const restoreSnapshot = (
  projectId: number,
  documentId: number,
  id: number,
  { saveCurrent }: { saveCurrent: boolean }
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: `/api/v1/projects/${projectId}/documents/${documentId}/snapshots/${id}/restore`,
    data: {
      save_current: saveCurrent,
    },
  }).then(() => undefined) as Promise<void>;

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
