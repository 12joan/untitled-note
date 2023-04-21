import axios, { AxiosProgressEvent } from 'axios';
import { allocateFile, deleteFile } from '~/lib/apis/file';
import { S3File } from '~/lib/types';

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
  const {
    presigned_post: presignedPost,
    ...s3File
  } = await allocateFile(projectId, {
    role,
    filename: file.name,
    size: file.size,
    content_type: file.type || 'application/octet-stream',
  });

  onUploadStart(s3File);

  try {
    const { url, fields } = presignedPost;

    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const uploadResponse = await axios.post(url, formData, {
      signal: abortSignal,
      onUploadProgress,
    });

    if (!String(uploadResponse.status).match(/2\d{2}/)) {
      // eslint-disable-next-line no-console
      console.error(uploadResponse);
      throw new Error('Upload failed');
    }

    await withinTransaction(s3File);

    return s3File;
  } catch (error) {
    deleteFile(s3File.id).catch((destroyError) => {
      // eslint-disable-next-line no-console
      console.error('Failed to destroy file after upload error');
      // eslint-disable-next-line no-console
      console.error(destroyError);
    });

    throw error;
  }
};
