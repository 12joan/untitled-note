import imageCompression from 'browser-image-compression'

import S3FilesAPI from '~/lib/resources/S3FilesAPI'
import ProjectImageAPI from '~/lib/resources/ProjectImageAPI'

const uploadProjectImage = async ({ project, file: originalFile, availableSpace }) => {
  const maxSize = Math.min(availableSpace, 300 * 1024)

  // 3000 bytes is roughly the smallest imageCompression can make an image
  if (originalFile.size > maxSize && maxSize < 3000) {
    return Promise.reject({
      customErrorMessage: 'You do not have enough storage space to upload this image.',
    })
  }

  const compressedFile = await imageCompression(originalFile, {
    maxSizeMB: maxSize / 1048576,
    maxWidthOrHeight: 512,
    useWebWorker: true,
  })

  const api = S3FilesAPI(project.id)

  const { presigned_post, ...s3File } = await api.create({
    role: 'project-image',
    filename: originalFile.name,
    size: compressedFile.size,
    content_type: originalFile.type,
  })

  try {
    const { url, fields } = presigned_post

    const formData = new FormData()

    Object.entries({ ...fields, file: compressedFile }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const uploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      console.error(uploadResponse)
      throw new Error('Upload failed')
    }

    const setImageResponse = await ProjectImageAPI(project.id).update({
      image_id: s3File.id,
    })

    if (!setImageResponse.ok) {
      console.error(setImageResponse)
      throw new Error('Failed to set project image')
    }

    return s3File
  } catch (error) {
    api.destroy(s3File).catch(destroyError => {
      console.error('Failed to destroy file after upload error')
      console.error(destroyError)
    })

    throw error
  }
}

const removeProjectImage = project => ProjectImageAPI(project.id).update({ image_id: null })

export { uploadProjectImage, removeProjectImage }