import Compressor from 'compressorjs'

import uploadFile from '~/lib/uploadFile'
import ProjectImageAPI from '~/lib/resources/ProjectImageAPI'

const uploadProjectImage = async ({ projectId, file: originalFile, availableSpace, showFileStorage }) => {
  const compressedFile = await new Promise((resolve, reject) => {
    new Compressor(originalFile, {
      mimeType: 'image/jpeg',
      maxWidth: 512,
      maxHeight: 512,
      success: resolve,
      error: reject,
    })
  })

  if (compressedFile.size > availableSpace) {
    return Promise.reject({
      reason: 'notEnoughSpace',
      data: {
        requiredSpace: compressedFile.size,
        availableSpace,
        showFileStorage,
      },
    })
  }

  return uploadFile({
    projectId,
    file: compressedFile,
    role: 'project-image',
    withinTransaction: async s3File => {
      const setImageResponse = await ProjectImageAPI(projectId).update({
        image_id: s3File.id,
      })

      if (!setImageResponse.ok) {
        console.error(setImageResponse)
        throw new Error('Failed to set project image')
      }
    },
  })
}

const removeProjectImage = projectId => ProjectImageAPI(projectId).update({ image_id: null })

export { uploadProjectImage, removeProjectImage }
