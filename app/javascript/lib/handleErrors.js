import createToast from '~/lib/createToast'

const handleErrors = toastForError => promise => promise.catch(error => {
  console.log(error)

  try {
    createToast(toastForError(error))
  } catch (error) {
    console.error('Error while creating toast:', error)
  }

  throw error
})

const handleCreateProjectError = handleErrors(() => ({
  title: 'Failed to create project',
  message: 'An error occurred while creating a new project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleRenameProjectError = handleErrors(() => ({
  title: 'Failed to rename project',
  message: 'An error occurred while renaming the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleUploadProjectImageError = handleErrors(() => ({
  title: 'Failed to upload project image',
  message: 'An error occurred while uploading the project image. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleRemoveProjectImageError = handleErrors(() => ({
  title: 'Failed to remove project image',
  message: 'An error occurred while removing the project image. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleDeleteProjectError = handleErrors(() => ({
  title: 'Failed to delete project',
  message: 'An error occurred while deleting the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleReorderProjectsError = handleErrors(() => ({
  title: 'Failed to reorder projects',
  message: 'An error occurred while reordering the projects. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleCreateDocumentError = handleErrors(() => ({
  title: 'Failed to create document',
  message: 'An error occurred while creating a new document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleUpdateDocumentError = handleErrors(() => ({
  title: 'Failed to update document',
  message: 'An error occurred while updating the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleDeleteDocumentError = handleErrors(() => ({
  title: 'Failed to delete document',
  message: 'An error occurred while deleting the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

export {
  handleCreateProjectError,
  handleRenameProjectError,
  handleUploadProjectImageError,
  handleRemoveProjectImageError,
  handleDeleteProjectError,
  handleReorderProjectsError,
  handleCreateDocumentError,
  handleUpdateDocumentError,
  handleDeleteDocumentError,
}
