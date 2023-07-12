import { useMemo } from 'react';
import { PlatePlugin } from '@udecode/plate';
import { useContext } from '~/lib/context';
import { Future, orDefaultFuture } from '~/lib/monads';
import { AccountModalOpenProps } from '~/lib/useAccountModal';
import { Attachment } from './components/Attachment';
import { ELEMENT_ATTACHMENT } from './constants';
import { createAttachmentPlugin } from './plugin';
import { getUploadIsInProgress } from './uploadsInProgressStore';

export const useAttachmentPlugins = (): PlatePlugin[] => {
  const { projectId, futureRemainingQuota, toggleAccountModal } =
    useContext() as {
      projectId: number;
      futureRemainingQuota: Future<number>;
      toggleAccountModal: (props: AccountModalOpenProps) => void;
    };

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
