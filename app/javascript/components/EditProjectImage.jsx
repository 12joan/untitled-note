import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

import { useContext } from '~/lib/context'
import useOverrideable from '~/lib/useOverrideable'
import { handleUploadProjectImageError, handleRemoveProjectImageError } from '~/lib/handleErrors'
import S3FilesAPI from '~/lib/resources/S3FilesAPI'
import ProjectImageAPI from '~/lib/resources/ProjectImageAPI'

import ReplaceWithSpinner from '~/components/ReplaceWithSpinner'

const uploadProjectImage = async (project, originalFile) => {
  const compressedFile = await imageCompression(originalFile, {
    maxSizeMB: 300 / 1024,
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

const EditProjectImage = () => {
  const fileInputRef = useRef(null)

  const { project } = useContext()
  const [hasImage, overrideHasImage] = useOverrideable(!!project.image_url)

  const [state, setState] = useState('idle')
  const isIdle = state === 'idle'
  const isUploading = state === 'uploading'
  const isRemoving = state === 'removing'

  const showFileSelector = () => {
    const fileInput = fileInputRef.current
    fileInput.value = null
    fileInput.click()
  }

  const handleFileSelected = event => {
    const originalFile = event.target.files[0]

    if (!originalFile) {
      return
    }

    setState('uploading')

    handleUploadProjectImageError(
      uploadProjectImage(project, originalFile).then(() => overrideHasImage(true))
    ).finally(() => setState('idle'))
  }

  const handleRemove = () => {
    setState('removing')

    handleRemoveProjectImageError(
      removeProjectImage(project).then(() => overrideHasImage(false))
    ).finally(() => setState('idle'))
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelected}
      />

      <div className="font-medium select-none mb-2">Project image</div>

      <div className="space-x-2">
        <button
          type="button"
          className="btn btn-rect btn-primary relative"
          onClick={showFileSelector}
          disabled={!isIdle}
        >
          <ReplaceWithSpinner isSpinner={isUploading} spinnerAriaLabel="Uploading image">
            {hasImage ? 'Replace' : 'Upload'} image
          </ReplaceWithSpinner>
        </button>

        {hasImage && (
          <button
            type="button"
            className="btn btn-rect btn-secondary text-red-500 dark:text-red-400"
            onClick={handleRemove}
            disabled={!isIdle}
          >
            <ReplaceWithSpinner isSpinner={isRemoving} spinnerAriaLabel="Removing image">
              Remove image
            </ReplaceWithSpinner>
          </button>
        )}
      </div>
    </div>
  )
}

export default EditProjectImage
