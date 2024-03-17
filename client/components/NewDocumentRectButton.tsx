import React from 'react';
import { twMerge } from 'tailwind-merge';
import { NewDocumentLink } from '~/lib/routes';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';

export interface NewDocumentRectButtonProps {
  className?: string;
}

export const NewDocumentRectButton = ({
  className,
}: NewDocumentRectButtonProps) => {
  return (
    <NewDocumentLink
      className={twMerge(
        'btn btn-rect btn-primary inline-flex gap-2 items-center',
        className
      )}
    >
      <NewDocumentIcon size="1.25em" noAriaLabel />
      New document
    </NewDocumentLink>
  );
};
