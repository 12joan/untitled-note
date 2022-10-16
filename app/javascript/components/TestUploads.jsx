// TODO: Delete this file

import React, { useRef } from 'react'
import imageCompression from 'browser-image-compression'

import { useContext } from '~/lib/context'
import S3FilesAPI from '~/lib/resources/S3FilesAPI'

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

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      return s3File
    } else {
      console.error(response)
      throw new Error('Upload failed')
    }
  } catch (error) {
    api.destroy(s3File).catch(destroyError => {
      console.error('Failed to destroy file after upload error')
      console.error(destroyError)
    })

    throw error
  }
}

const TestUploads = () => {
  const { project } = useContext()
  const fileInputRef = useRef(null)

  const handleUpload = () => {
    const originalFile = fileInputRef.current.files[0]

    uploadProjectImage(project, originalFile).then(
      s3File => {
        console.log(s3File)
      },
      error => {
        // TODO: handle error
        console.error(error)
      }
    )
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" />

      <button type="button" onClick={handleUpload} className="bg-slate-100 w-fit p-4">
        Upload
      </button>
    </>
  )
}

export default TestUploads
