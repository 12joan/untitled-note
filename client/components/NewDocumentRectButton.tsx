import { twMerge } from 'tailwind-merge';
import NewDocumentIcon from '~/components/icons/NewDocumentIcon';
import { NewDocumentLink } from '~/lib/routes';

export interface NewDocumentRectButtonProps {
  className?: string;
}

export const NewDocumentRectButton = ({
  className,
}: NewDocumentRectButtonProps) => (
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
