import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { commonClassNames } from '../commonClassNames';
import { BaseAttachmentProps } from '../types';

export const DeletedAttachment = ({
  className: classNameProp,
}: BaseAttachmentProps) => {
  const className = groupedClassNames(commonClassNames, classNameProp, {
    color: 'text-plain-500 dark:text-plain-400',
  });

  return <div className={className}>Deleted file</div>;
};
