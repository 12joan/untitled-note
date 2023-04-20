import { streamAction } from '~/channels/dataChannel';
import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { File, StorageQuotaUsage } from '~/lib/types';

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
  callback: (files: File[]) => void
) => streamAction(
  'FileStorage',
  'files',
  {},
  callback
);
