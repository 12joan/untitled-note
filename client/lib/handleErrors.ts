import { filesize } from '~/lib/filesize';
import { createToast } from '~/lib/toasts';
import { ToastWithoutId } from '~/lib/types';

const handleErrors =
  (toastForError: (error: any) => ToastWithoutId) =>
  <T>(promise: Promise<T>): Promise<T> => {
    return promise.catch((error: any) => {
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
  };

export const handleCreateProjectError = handleErrors(() => ({
  title: 'Failed to create project',
  message:
    'An error occurred while creating a new project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUpdateProjectError = handleErrors(() => ({
  title: 'Failed to update project details',
  message:
    'An error occurred while updating the project details. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleRemoveProjectImageError = handleErrors(() => ({
  title: 'Failed to remove project image',
  message:
    'An error occurred while removing the project image. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleDeleteProjectError = handleErrors(() => ({
  title: 'Failed to delete project',
  message:
    'An error occurred while deleting the project. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleCreateProjectFolderError = handleErrors(() => ({
  title: 'Failed to create folder',
  message:
    'An error occurred while creating a new folder. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUpdateProjectFolderError = handleErrors(() => ({
  title: 'Failed to update folder',
  message:
    'An error occurred while updating the folder. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleDeleteProjectFolderError = handleErrors(() => ({
  title: 'Failed to delete folder',
  message:
    'An error occurred while deleting the folder. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleCreateDocumentError = handleErrors(() => ({
  title: 'Failed to create document',
  message:
    'An error occurred while creating a new document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUpdateDocumentError = handleErrors(() => ({
  title: 'Failed to update document',
  message:
    'An error occurred while updating the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleDeleteDocumentError = handleErrors(() => ({
  title: 'Failed to delete document',
  message:
    'An error occurred while deleting the document. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleCreateSnapshotError = handleErrors(() => ({
  title: 'Failed to create snapshot',
  message:
    'An error occurred while creating the snapshot. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUpdateSnapshotError = handleErrors(() => ({
  title: 'Failed to update snapshot',
  message:
    'An error occurred while deleting the snapshot. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleRestoreSnapshotError = handleErrors(() => ({
  title: 'Failed to restore snapshot',
  message:
    'An error occurred while restoring the snapshot. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleDeleteSnapshotError = handleErrors(() => ({
  title: 'Failed to delete snapshot',
  message:
    'An error occurred while updating the snapshot. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleRenameTagError = handleErrors((error) => {
  if (error.response?.status === 422) {
    return {
      title: 'Tag name already exists',
      message:
        'A tag with this name already exists. Please choose a different name.',
      autoClose: 'slow',
    };
  }

  return {
    title: 'Failed to rename tag',
    message:
      'An error occurred while renaming the tag. Make sure you are connected to the internet and try again.',
    autoClose: 'slow',
  };
});

export const handleDeleteFileError = handleErrors(() => ({
  title: 'Failed to delete file',
  message:
    'An error occurred while deleting the file. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleReplaceError = handleErrors(() => ({
  title: 'Failed to replace text',
  message:
    'An error occurred while replacing text. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUploadAttachmentError = handleErrors(() => ({
  title: 'Failed to upload attachment',
  message:
    'An error occurred while uploading the attachment. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));

export const handleUploadFileError = handleErrors(({ reason, data = {} }) => {
  if (reason === 'notEnoughSpace') {
    const requiredSpace = filesize(data.requiredSpace);
    const availableSpace = filesize(data.availableSpace);

    return {
      title: 'Not enough space to complete upload',
      message: `${requiredSpace} is required to complete the upload. You have ${availableSpace} remaining.`,
      autoClose: 'slow',
      button: {
        label: 'Storage usage',
        onClick: data.showFileStorage,
      },
    };
  }

  return {
    title: 'Failed to complete upload',
    message:
      'An error occurred while completing the upload. Make sure you are connected to the internet and try again.',
    autoClose: 'slow',
  };
});

export const handleUpdateSettingsError = handleErrors(() => ({
  title: 'Failed to update settings',
  message:
    'An error occurred while updating the settings. Make sure you are connected to the internet and try again.',
  autoClose: 'slow',
}));
