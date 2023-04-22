import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { commonClassNames } from '../commonClassNames';
import { BaseAttachmentProps } from '../types';

export const DeletedAttachment = ({
  selectedClassNames,
}: BaseAttachmentProps) => {
  const className = groupedClassNames(commonClassNames, selectedClassNames, {
    reset: null,
    color: 'text-slate-500 dark:text-slate-400',
  });

  return <div className={className}>Deleted file</div>;
};
