import {
  getPluginOptions,
  insertNodes,
  PlateEditor,
  removeNodes,
  withoutNormalizing,
} from '~/lib/editor/plate';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import { handleUploadFileError } from '~/lib/handleErrors';
import { uploadFile, UploadProgressEvent } from '~/lib/uploadFile';
import { ELEMENT_ATTACHMENT } from './constants';
import { AttachmentElement, AttachmentPlugin } from './types';
import { deregisterUpload, registerUpload } from './uploadsInProgressStore';
import { nodeAtPathIsEmptyParagraph, removeAllAttachmentNodes } from './utils';

export const insertAttachments = (
  editor: PlateEditor,
  blockIndex: number,
  files: File[]
) =>
  handleUploadFileError(
    new Promise((resolve, reject) => {
      const { projectId, availableSpace, showFileStorage } =
        getPluginOptions<AttachmentPlugin>(editor, ELEMENT_ATTACHMENT);

      const requiredSpace = files.reduce((total, file) => total + file.size, 0);

      if (requiredSpace > availableSpace) {
        reject({
          reason: 'notEnoughSpace',
          data: {
            requiredSpace,
            availableSpace,
            showFileStorage,
          },
        });
        return;
      }

      let shouldRemoveTargetBlock = nodeAtPathIsEmptyParagraph(editor, [
        blockIndex,
      ]);

      const addedIndices: number[] = [];

      files.forEach((file, index) => {
        let s3FileId: number | null = null;

        const abortController = new AbortController();

        const handleUploadStart = ({ id }: { id: number }) => {
          s3FileId = id;

          registerUpload(s3FileId, { abortController });

          const attachmentNode = {
            type: ELEMENT_ATTACHMENT,
            children: [{ text: '' }],
            s3FileId,
            filename: file.name,
          } as AttachmentElement;

          // The index (relative to blockIndex) we want to insert the attachment
          // node at is equal to the number of nodes whose indices are less than
          // ours that have been added so far.
          const relativeIndex = addedIndices.filter((i) => i < index).length;
          addedIndices.push(index);

          withoutNormalizing(editor, () => {
            // Performing the remove here to prevent issues with the editor being
            // in an invalid state. This may result in unwanted behaviour if
            // blockIndex no longer contains the empty paragraph.
            if (shouldRemoveTargetBlock) {
              removeNodes(editor, {
                at: [blockIndex],
              });

              shouldRemoveTargetBlock = false;
            }

            insertNodes(editor, attachmentNode, {
              at: [blockIndex + relativeIndex],
            });
          });
        };

        const handleUploadProgress = (progressEvent: UploadProgressEvent) =>
          dispatchGlobalEvent('s3File:uploadProgress', {
            s3FileId: s3FileId!,
            progressEvent,
          });

        uploadFile({
          projectId,
          file,
          role: 'attachment',
          abortSignal: abortController.signal,
          onUploadStart: handleUploadStart,
          onUploadProgress: handleUploadProgress,
        })
          .then(() => {
            if (s3FileId !== null) {
              deregisterUpload(s3FileId);
              dispatchGlobalEvent('s3File:uploadComplete', { s3FileId });
            }
          })
          .catch((error) => {
            if (s3FileId !== null) {
              removeAllAttachmentNodes(editor, s3FileId);
              deregisterUpload(s3FileId);
            }

            if (error.name !== 'CanceledError') {
              throw error;
            }
          })
          .then(resolve, reject);
      });
    })
  );
