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

const handleUpdateProjectError = handleErrors(() => ({
  title: 'Failed to update project',
  message: 'An error occurred while updating the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}))

const handleDeleteProjectError = handleErrors(() => ({
  title: 'Failed to delete project',
  message: 'An error occurred while deleting the project. Make sure you are connected to the internet and try again.',
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
  handleUpdateProjectError,
  handleDeleteProjectError,
  handleCreateDocumentError,
  handleUpdateDocumentError,
  handleDeleteDocumentError,
}
