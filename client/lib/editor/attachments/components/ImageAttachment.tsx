import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { ExtantAttachmentProps } from '../types';

export const ImageAttachment = ({
  s3File,
  selectedClassNames,
}: ExtantAttachmentProps) => {
  const className = groupedClassNames(selectedClassNames, {
    rounded: 'rounded-lg',
    margin: 'mx-auto',
    ringOffset: 'ring-offset-2',
  });

  const { url, filename } = s3File;

  return <img src={url} alt={filename} className={className} />;
};
