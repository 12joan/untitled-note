import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { LoadingView } from '~/components/LoadingView';
import { commonClassNames } from '../commonClassNames';
import { BaseAttachmentProps } from '../types';

export const PendingAttachment = ({
  selectedClassNames,
}: BaseAttachmentProps) => {
  const className = groupedClassNames(commonClassNames, selectedClassNames, {
    padding: 'p-5',
  });

  return (
    <div className={className}>
      <LoadingView style={{ paddingBottom: 0 }} showImmediately />
    </div>
  );
};
