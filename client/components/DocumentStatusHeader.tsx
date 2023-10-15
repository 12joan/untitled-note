import React from 'react';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { TimeAgo } from '~/components/TimeAgo';
import { dropdownItemClassNames } from './Dropdown';

export interface DocumentStatusHeaderProps {
  isDirty: boolean;
  isFailing: boolean;
  lastSuccessfulUpdate: Date;
}

export const DocumentStatusHeader = ({
  isDirty,
  isFailing,
  lastSuccessfulUpdate,
}: DocumentStatusHeaderProps) => {
  return (
    <div
      className={groupedClassNames(dropdownItemClassNames, {
        hocusBackgroundColor: undefined,
        cursor: 'cursor-default',
        padding: 'pt-3 pb-2 px-4',
      })}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-medium">
          <div
            className={groupedClassNames({
              base: 'w-2.5 h-2.5 rounded-full',
              color: (() => {
                if (isFailing) return 'bg-red-500';
                if (isDirty) return 'bg-yellow-500';
                return 'bg-green-500';
              })(),
            })}
          />

          {(() => {
            if (isFailing) return 'Unable to save';
            if (isDirty) return 'Unsaved changes';
            return 'Up to date';
          })()}
        </div>

        <p className="text-sm text-plain-500 dark:text-plain-400">
          Last saved{' '}
          <TimeAgo
            date={lastSuccessfulUpdate}
            timeStyle={{
              steps: [
                { formatAs: 'second' },
                { formatAs: 'minute' },
                { formatAs: 'hour' },
                { formatAs: 'day' },
              ],
              labels: ['mini', 'short'],
            }}
          />{' '}
          ago
        </p>
      </div>
    </div>
  );
};
