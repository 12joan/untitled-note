import { LoadingView } from '~/components/LoadingView';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { commonClassNames } from '../commonClassNames';
import type { BaseAttachmentProps } from '../types';

export const PendingAttachment = ({
  className: classNameProp,
}: BaseAttachmentProps) => {
  const className = groupedClassNames(commonClassNames, classNameProp, {
    padding: 'p-5',
  });

  return (
    <div className={className}>
      <LoadingView style={{ paddingBottom: 0 }} showImmediately />
    </div>
  );
};
