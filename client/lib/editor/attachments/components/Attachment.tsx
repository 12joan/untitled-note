import React, { useEffect, useState } from 'react';
import { fetchFile } from '~/lib/apis/file';
import { useGlobalEvent } from '~/lib/globalEvents';
import {
  failureFutureServiceResult,
  FutureServiceResult,
  pendingFutureServiceResult,
  promiseToFutureServiceResult,
  unwrapFutureServiceResult,
} from '~/lib/monads';
import { retry } from '~/lib/retry';
import { S3File } from '~/lib/types';
import { AttachmentElementProps, BaseAttachmentProps } from '../types';
import { getUploadIsInProgress } from '../uploadsInProgressStore';
import { useSelected } from '../utils';
import { DeletedAttachment } from './DeletedAttachment';
import { GenericAttachment } from './GenericAttachment';
import { ImageAttachment } from './ImageAttachment';
import { PendingAttachment } from './PendingAttachment';
import { UploadingAttachment } from './UploadingAttachment';

export const Attachment = (props: AttachmentElementProps) => {
  const {
    element: { s3FileId },
  } = props;

  const [isUploading, setIsUploading] = useState(() =>
    getUploadIsInProgress(s3FileId)
  );

  useGlobalEvent(
    's3File:uploadComplete',
    ({ s3FileId: completedS3FileId }) => {
      if (completedS3FileId === s3FileId) {
        setIsUploading(false);
      }
    },
    [s3FileId]
  );

  return isUploading ? (
    <UploadingAttachment {...props} />
  ) : (
    <UploadedAttachment {...props} />
  );
};

const UploadedAttachment = ({
  attributes,
  children,
  element,
}: AttachmentElementProps) => {
  const { s3FileId } = element;

  const [fsrFetchedData, setFsrFetchedData] = useState<
    FutureServiceResult<S3File, any>
  >(() => pendingFutureServiceResult());

  useEffect(() => {
    promiseToFutureServiceResult(
      retry(() => fetchFile(s3FileId), {
        maxRetries: Infinity,
        shouldRetry: (error: any) => error?.response?.status !== 404,
      }),
      setFsrFetchedData
    );
  }, []);

  useGlobalEvent('s3File:delete', ({ s3FileId: deletedS3FileId }) => {
    if (deletedS3FileId === s3FileId) {
      setFsrFetchedData(failureFutureServiceResult(null));
    }
  });

  const isSelected = useSelected();

  const commonProps: BaseAttachmentProps = {
    selectedClassNames: {
      focusRing: isSelected && 'focus-ring',
    },
  };

  return (
    <div {...attributes}>
      <div contentEditable={false} data-testid="uploaded-attachment">
        {unwrapFutureServiceResult(fsrFetchedData, {
          pending: <PendingAttachment {...commonProps} />,
          failure: () => <DeletedAttachment {...commonProps} />,
          success: (s3File) =>
            /^image\/(?!svg\+xml$)/.test(s3File.content_type) ? (
              <ImageAttachment {...commonProps} s3File={s3File} />
            ) : (
              <GenericAttachment {...commonProps} s3File={s3File} />
            ),
        })}
      </div>

      {children}
    </div>
  );
};
