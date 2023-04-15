import createToast from '~/lib/createToast';
import filesize from '~/lib/filesize';

const handleErrors = (toastForError) => (promise) =>
  promise.catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);

    try {
      createToast(toastForError(error));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while creating toast:', error);
    }

    throw error;
  });

const handleCreateProjectError = handleErrors(() => ({
  title: 'Failed to create project',
  message:
    'An error occurred while creating a new project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleUpdateProjectError = handleErrors(() => ({
  title: 'Failed to update project details',
  message:
    'An error occurred while updating the project details. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleRemoveProjectImageError = handleErrors(() => ({
  title: 'Failed to remove project image',
  message:
    'An error occurred while removing the project image. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleArchiveProjectError = handleErrors(() => ({
  title: 'Failed to archive project',
  message:
    'An error occurred while archiving the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleUnarchiveProjectError = handleErrors(() => ({
  title: 'Failed to unarchive project',
  message:
    'An error occurred while unarchiving the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleDeleteProjectError = handleErrors(() => ({
  title: 'Failed to delete project',
  message:
    'An error occurred while deleting the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleReorderProjectsError = handleErrors(() => ({
  title: 'Failed to reorder projects',
  message:
    'An error occurred while reordering the projects. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleCreateDocumentError = handleErrors(() => ({
  title: 'Failed to create document',
  message:
    'An error occurred while creating a new document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleUpdateDocumentError = handleErrors(() => ({
  title: 'Failed to update document',
  message:
    'An error occurred while updating the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleDeleteDocumentError = handleErrors(() => ({
  title: 'Failed to delete document',
  message:
    'An error occurred while deleting the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleRenameTagError = handleErrors((error) =>
  error.response?.status === 422
    ? {
        title: 'Tag name already exists',
        message:
          'A tag with this name already exists. Please choose a different name.',
        autoClose: 'slow',
      }
    : {
        title: 'Failed to rename tag',
        message:
          'An error occurred while renaming the tag. Make sure you are connected to the internet and try again.',
        autoClose: 'slow',
      }
);

const handleDeleteFileError = handleErrors(() => ({
  title: 'Failed to delete file',
  message:
    'An error occurred while deleting the file. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleResetPasswordError = handleErrors(() => ({
  title: 'Failed to reset password',
  message:
    'An error occurred while resetting your password. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleReplaceError = handleErrors(() => ({
  title: 'Failed to replace text',
  message:
    'An error occurred while replacing text. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleUploadAttachmentError = handleErrors(() => ({
  title: 'Failed to upload attachment',
  message:
    'An error occurred while uploading the attachment. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

const handleUploadFileError = handleErrors(
  ({ reason = undefined, data = {} }) =>
    ({
      notEnoughSpace: {
        title: 'Not enough space to complete upload',
        message: `${filesize(
          data.requiredSpace
        )} is required to complete the upload. You have ${filesize(
          data.availableSpace
        )} remaining.`,
        autoClose: 'slow',
        button: {
          label: 'View storage usage',
          onClick: data.showFileStorage,
        },
      },
      [undefined]: {
        title: 'Failed to complete upload',
        message:
          'An error occurred while completing the upload. Make sure you are connected to the internet and try again.',
        autoClose: 'slow',
      },
    }[reason])
);

export {
  handleCreateProjectError,
  handleUpdateProjectError,
  handleRemoveProjectImageError,
  handleArchiveProjectError,
  handleUnarchiveProjectError,
  handleDeleteProjectError,
  handleReorderProjectsError,
  handleCreateDocumentError,
  handleUpdateDocumentError,
  handleDeleteDocumentError,
  handleRenameTagError,
  handleDeleteFileError,
  handleResetPasswordError,
  handleReplaceError,
  handleUploadAttachmentError,
  handleUploadFileError,
};
