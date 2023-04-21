import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { S3File, StorageQuotaUsage } from '~/lib/types';

import { streamAction } from '~/channels/dataChannel';

export type AllocateFileResult = S3File & {
  presigned_post: {
    url: string;
    fields: Record<string, string>;
  };
};

export const allocateFile = (
  projectId: number,
  file: Pick<S3File, 'role' | 'filename' | 'size' | 'content_type'>
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: '/api/v1/s3_files',
    data: { file, project_id: projectId },
  }).then((response) => response.json()) as Promise<AllocateFileResult>;

export const fetchFile = (id: number) =>
  fetchAPIEndpoint({
    method: 'GET',
    path: `/api/v1/s3_files/${id}`,
  }).then((response) => response.json()) as Promise<S3File>;

export const deleteFile = (id: number) =>
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/s3_files/${id}`,
  });

export const streamQuotaUsage = (
  callback: (quotaUsage: StorageQuotaUsage) => void
) => streamAction('FileStorage', 'quota_usage', {}, callback);

export const streamFiles = (callback: (files: S3File[]) => void) =>
  streamAction('FileStorage', 'files', {}, callback);
