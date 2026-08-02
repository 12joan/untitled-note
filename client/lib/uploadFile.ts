import axios, { type AxiosProgressEvent, CanceledError } from 'axios';
import { allocateFile, deleteFile } from '~/lib/apis/file';
import type { S3File } from '~/lib/types';

export type UploadProgressEvent = AxiosProgressEvent;

export interface UploadFileOptions {
  projectId: number;
  file: File | Blob;
  role: S3File['role'];
  withinTransaction?: (s3File: S3File) => Promise<void>;
  abortSignal?: AbortSignal;
  onUploadStart?: (s3File: S3File) => void;
  onUploadProgress?: (event: UploadProgressEvent) => void;
}

export const uploadFile = async ({
  projectId,
  file,
  role,
  withinTransaction = () => Promise.resolve(),
  abortSignal,
  onUploadStart = () => {},
  onUploadProgress = () => {},
}: UploadFileOptions) => {
  const { presigned_post: presignedPost, ...s3File } = await allocateFile(
    projectId,
    {
      role,
      filename: file.name,
      size: file.size,
      content_type: file.type || 'application/octet-stream',
    }
  );

  onUploadStart(s3File);

  try {
    const { url, fields } = presignedPost;

    const formData = new FormData();

    for (const [key, value] of Object.entries({ ...fields, file })) {
      formData.append(key, value);
    }

    const uploadResponse = await axios.post(url, formData, {
      signal: abortSignal,
      onUploadProgress,
    });

    // Simulate an indefinite upload duration
    if (window.fileUploadInfinite) {
      await new Promise((_resolve, reject) => {
        abortSignal?.addEventListener('abort', () =>
          reject(new CanceledError())
        );
      });
    }

    if (!String(uploadResponse.status).match(/2\d{2}/)) {
      // biome-ignore lint/suspicious/noConsole: logging
      console.error(uploadResponse);
      throw new Error('Upload failed');
    }

    await withinTransaction(s3File);

    return s3File;
  } catch (error) {
    deleteFile(s3File.id).catch((destroyError) => {
      // biome-ignore lint/suspicious/noConsole: logging
      console.error('Failed to destroy file after upload error');
      // biome-ignore lint/suspicious/noConsole: logging
      console.error(destroyError);
    });

    throw error;
  }
};
