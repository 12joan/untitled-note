import Compressor from 'compressorjs';
import { updateProjectImage } from '~/lib/apis/project';
import { uploadFile } from '~/lib/uploadFile';

export interface UploadProjectImageOptions {
  projectId: number;
  file: File;
  availableSpace: number;
  showFileStorage: () => void;
}

export const uploadProjectImage = async ({
  projectId,
  file: originalFile,
  availableSpace,
  showFileStorage,
}: UploadProjectImageOptions) => {
  const compressedFile: File | Blob = await new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(originalFile, {
      mimeType: 'image/jpeg',
      maxWidth: 512,
      maxHeight: 512,
      success: resolve,
      error: reject,
    });
  });

  if (compressedFile.size > availableSpace) {
    return Promise.reject({
      reason: 'notEnoughSpace',
      data: {
        requiredSpace: compressedFile.size,
        availableSpace,
        showFileStorage,
      },
    });
  }

  return uploadFile({
    projectId,
    file: compressedFile,
    role: 'project-image',
    withinTransaction: async (s3File) => {
      const setImageResponse = await updateProjectImage(projectId, s3File.id);

      if (!setImageResponse.ok) {
        // eslint-disable-next-line no-console
        console.error(setImageResponse);
        throw new Error('Failed to set project image');
      }
    },
  });
};

export const removeProjectImage = (projectId: number) =>
  updateProjectImage(projectId, null);
