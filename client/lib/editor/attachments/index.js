import { useMemo } from 'react';
import { useContext } from '~/lib/context';
import Attachment from './components/Attachment';
import { ELEMENT_ATTACHMENT } from './constants';
import { createAttachmentPlugin } from './plugin';
import uploadsInProgressStore from './uploadsInProgressStore';

const useAttachmentPlugins = () => {
  const { projectId, futureRemainingQuota, showAccountModal } = useContext();

  return useMemo(
    () => [
      createAttachmentPlugin({
        options: {
          projectId,
          availableSpace: futureRemainingQuota.orDefault(Infinity),
          showFileStorage: () =>
            showAccountModal({ initialSection: 'fileStorage' }),
        },
      }),
    ],
    [projectId, futureRemainingQuota]
  );
};

const getAttachmentIsUploading = ({ s3FileId }) =>
  uploadsInProgressStore.isInProgress(s3FileId);

export {
  ELEMENT_ATTACHMENT,
  useAttachmentPlugins,
  getAttachmentIsUploading,
  Attachment,
};
