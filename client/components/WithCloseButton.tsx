import React, { ReactNode } from 'react';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';

export interface WithCloseButtonProps {
  onClose: () => void;
  wrapperClassName?: GroupedClassNames;
  buttonClassName?: GroupedClassNames;
  'aria-label'?: string;
  children: ReactNode;
}

export const WithCloseButton = ({
  onClose,
  wrapperClassName,
  buttonClassName,
  'aria-label': ariaLabel = 'Close',
  children,
}: WithCloseButtonProps) => {
  return (
    <div
      className={groupedClassNames(
        {
          display: 'flex',
          items: 'items-center',
          justify: 'justify-between',
          gap: 'gap-2',
        },
        wrapperClassName
      )}
    >
      {children}

      <button
        type="button"
        className={groupedClassNames(
          {
            btn: 'btn',
            rounded: 'btn-no-rounded rounded-full',
            padding: 'p-2',
            aspect: 'aspect-square',
            shrink: 'shrink-0',
          },
          buttonClassName
        )}
        aria-label={ariaLabel}
        onClick={onClose}
      >
        <LargeCloseIcon size="1.25em" noAriaLabel />
      </button>
    </div>
  );
};
