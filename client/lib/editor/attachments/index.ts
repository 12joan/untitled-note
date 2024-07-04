import { useMemo } from 'react';
import { useAppContext } from '~/lib/appContext';
import { PlatePlugin } from '~/lib/editor/plate';
import { orDefaultFuture } from '~/lib/monads';
import { Attachment } from './components/Attachment';
import { ELEMENT_ATTACHMENT } from './constants';
import { createAttachmentPlugin } from './plugin';
import { getUploadIsInProgress } from './uploadsInProgressStore';

export const useAttachmentPlugins = (): PlatePlugin[] => {
  const projectId = useAppContext('projectId');
  const futureRemainingQuota = useAppContext('futureRemainingQuota');
  const toggleFilesModal = useAppContext('toggleFilesModal');

  return useMemo(
    () => [
      createAttachmentPlugin({
        options: {
          projectId,
          availableSpace: orDefaultFuture(futureRemainingQuota, Infinity),
          showFileStorage: () => toggleFilesModal(),
        },
      }) as PlatePlugin,
    ],
    [projectId, futureRemainingQuota]
  );
};

export const getAttachmentIsUploading = ({ s3FileId }: { s3FileId: number }) =>
  getUploadIsInProgress(s3FileId);

export { ELEMENT_ATTACHMENT, Attachment };
