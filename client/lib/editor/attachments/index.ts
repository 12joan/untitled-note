import { useMemo } from 'react';
import { PlatePlugin } from '@udecode/plate';
import { useAppContext } from '~/lib/appContext';
import { orDefaultFuture } from '~/lib/monads';
import { Attachment } from './components/Attachment';
import { ELEMENT_ATTACHMENT } from './constants';
import { createAttachmentPlugin } from './plugin';
import { getUploadIsInProgress } from './uploadsInProgressStore';

export const useAttachmentPlugins = (): PlatePlugin[] => {
  const projectId = useAppContext('projectId');
  const futureRemainingQuota = useAppContext('futureRemainingQuota');
  const toggleAccountModal = useAppContext('toggleAccountModal');

  return useMemo(
    () => [
      createAttachmentPlugin({
        options: {
          projectId,
          availableSpace: orDefaultFuture(futureRemainingQuota, Infinity),
          showFileStorage: () =>
            toggleAccountModal({ initialSection: 'fileStorage' }),
        },
      }) as PlatePlugin,
    ],
    [projectId, futureRemainingQuota]
  );
};

export const getAttachmentIsUploading = ({ s3FileId }: { s3FileId: number }) =>
  getUploadIsInProgress(s3FileId);

export { ELEMENT_ATTACHMENT, Attachment };
