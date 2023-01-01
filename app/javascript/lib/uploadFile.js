import axios from 'axios'

import S3FilesAPI from '~/lib/resources/S3FilesAPI'

const uploadFile = async ({
  projectId,
  file,
  role,
  withinTransaction = () => {},
  abortSignal = null,
  onUploadProgress = () => {},
}) => {
  const api = S3FilesAPI(projectId)

  const { presigned_post, ...s3File } = await api.create({
    role,
    filename: file.name,
    size: file.size,
    content_type: file.type || 'application/octet-stream',
  })

  try {
    const { url, fields } = presigned_post

    const formData = new FormData()

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const uploadResponse = await axios.post(url, formData, {
      signal: abortSignal,
      onUploadProgress,
    })

    if (!String(uploadResponse.status).match(/2\d{2}/)) {
      console.error(uploadResponse)
      throw new Error('Upload failed')
    }

    await withinTransaction(s3File)

    return s3File
  } catch (error) {
    api.destroy(s3File).catch(destroyError => {
      console.error('Failed to destroy file after upload error')
      console.error(destroyError)
    })

    throw error
  }
}

export default uploadFile
