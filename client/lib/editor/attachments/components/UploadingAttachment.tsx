import React, { useState } from 'react';
import { filesize } from '~/lib/filesize';
import { useGlobalEvent } from '~/lib/globalEvents';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Meter } from '~/components/Meter';
import { commonClassNames } from '../commonClassNames';
import { AttachmentElementProps } from '../types';
import { useSelected } from '../utils';

export const UploadingAttachment = ({
  attributes,
  children,
  element,
  nodeProps,
}: AttachmentElementProps) => {
  const { s3FileId, filename } = element;

  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(Infinity);

  useGlobalEvent(
    's3File:uploadProgress',
    ({ s3FileId: updatedS3FileId, progressEvent }) => {
      if (updatedS3FileId === s3FileId) {
        setUploadedBytes(progressEvent.loaded);
        setTotalBytes(progressEvent.total ?? Infinity);
      }
    },
    [s3FileId]
  );

  const isSelected = useSelected();

  const className = groupedClassNames(commonClassNames, {
    display: null,
    spacing: 'space-y-2',
    focusRing: isSelected && 'focus-ring',
    nodeProps: nodeProps?.className,
  });

  return (
    <div {...attributes}>
      <div
        contentEditable={false}
        {...nodeProps}
        className={className}
        data-testid="uploading-attachment"
      >
        <div>
          Uploading <span className="font-medium">{filename}</span>
        </div>

        <Meter value={uploadedBytes} max={totalBytes} />

        <div
          className="text-sm text-plain-500 dark:text-plain-400"
          role="status"
        >
          {filesize(uploadedBytes)} of{' '}
          {totalBytes === Infinity ? '?' : filesize(totalBytes)} uploaded
        </div>
      </div>

      {children}
    </div>
  );
};
