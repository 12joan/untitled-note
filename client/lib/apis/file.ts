import { streamAction } from '~/channels/dataChannel';
import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { S3File, StorageQuotaUsage } from '~/lib/types';

export type AllocateFileResult = S3File & {
  presigned_post: {
    url: string;
    fields: Record<string, string>;
  };
};

export const allocateFile = (
  projectId: number,
  file: Pick<S3File, 'role' | 'filename' | 'size' | 'content_type'>
) => fetchAPIEndpoint({
  method: 'POST',
  path: '/api/v1/s3_files',
  data: { file, project_id: projectId },
}).then((response) => response.json()) as Promise<AllocateFileResult>

export const deleteFile = (id: number) => fetchAPIEndpoint({
  method: 'DELETE',
  path: `/api/v1/s3_files/${id}`,
});

export const streamQuotaUsage = (
  callback: (quotaUsage: StorageQuotaUsage) => void
) => streamAction(
  'FileStorage',
  'quota_usage',
  {},
  callback
);

export const streamFiles = (
  callback: (files: S3File[]) => void
) => streamAction(
  'FileStorage',
  'files',
  {},
  callback
);
