import imageCompression from 'browser-image-compression'

import uploadFile from '~/lib/uploadFile'
import ProjectImageAPI from '~/lib/resources/ProjectImageAPI'

const uploadProjectImage = async ({ projectId, file: originalFile, availableSpace, showFileStorage }) => {
  const maxSize = Math.min(availableSpace, 300 * 1024)

  // 3000 bytes is roughly the smallest imageCompression can make an image
  if (originalFile.size > maxSize && maxSize < 3000) {
    return Promise.reject({
      reason: 'notEnoughSpace',
      data: {
        requiredSpace: 3000,
        availableSpace,
        showFileStorage,
      },
    })
  }

  const compressedFile = await imageCompression(originalFile, {
    maxSizeMB: maxSize / 1048576,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  })

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
