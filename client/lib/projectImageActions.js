import Compressor from 'compressorjs';
import ProjectImageAPI from '~/lib/resources/ProjectImageAPI';
import uploadFile from '~/lib/uploadFile';

const uploadProjectImage = async ({
  projectId,
  file: originalFile,
  availableSpace,
  showFileStorage,
}) => {
  const compressedFile = await new Promise((resolve, reject) => {
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
      const setImageResponse = await ProjectImageAPI(projectId).update({
        image_id: s3File.id,
      });

      if (!setImageResponse.ok) {
        // eslint-disable-next-line no-console
        console.error(setImageResponse);
        throw new Error('Failed to set project image');
      }
    },
  });
};

const removeProjectImage = (projectId) =>
  ProjectImageAPI(projectId).update({ image_id: null });

export { uploadProjectImage, removeProjectImage };
