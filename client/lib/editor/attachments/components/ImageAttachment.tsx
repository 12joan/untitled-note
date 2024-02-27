import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { ExtantAttachmentProps } from '../types';

export const ImageAttachment = ({
  s3File,
  className: classNameProp,
}: ExtantAttachmentProps) => {
  const className = groupedClassNames(classNameProp, {
    rounded: 'rounded-lg',
    margin: 'mx-auto',
    ringOffset: 'ring-offset-2',
    diff: 'diff:ring-diff-500 diff:ring-2',
  });

  const { url, filename } = s3File;

  return <img src={url} alt={filename} className={className} />;
};
