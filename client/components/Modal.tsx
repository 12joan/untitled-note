import React, { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { AppContextProvider } from '~/lib/appContext';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import { WithCloseButton } from '~/components/WithCloseButton';

export interface ModalRootProps extends Record<string, any> {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export const ModalRoot = ({
  open,
  onClose,
  className: userClassName = '',
  ...otherProps
}: ModalRootProps) => {
  const className = `${userClassName} modal-root relative z-30 ${
    open ? '' : 'pointer-events-none'
  }`;

  return (
    <AppContextProvider inModal>
      <Dialog
        static
        open={open}
        onClose={onClose}
        className={className}
        aria-hidden={!open}
        {...otherProps}
      />
    </AppContextProvider>
  );
};

export interface ModalTitleProps {
  className?: GroupedClassNames;
  children: ReactNode;
}

export const ModalTitle = ({ className, children }: ModalTitleProps) => {
  return (
    <Dialog.Title
      className={groupedClassNames(
        {
          heading: 'h2',
          select: 'select-none',
        },
        className
      )}
      children={children}
    />
  );
};

export interface ModalTitleWithCloseButtonProps extends ModalTitleProps {
  onClose: () => void;
}

export const ModalTitleWithCloseButton = ({
  onClose,
  ...otherProps
}: ModalTitleWithCloseButtonProps) => {
  return (
    <WithCloseButton onClose={onClose}>
      <ModalTitle {...otherProps} />
    </WithCloseButton>
  );
};

export const ModalPanel = Dialog.Panel;

export interface StyledModalProps {
  open: boolean;
  onClose: () => void;
  customBackdropClassNames?: GroupedClassNames;
  customPanelClassNames?: GroupedClassNames;
  children: ReactNode;
}

export const StyledModal = ({
  open,
  onClose,
  customBackdropClassNames,
  customPanelClassNames,
  children,
}: StyledModalProps) => {
  const backdropClassName = groupedClassNames(
    {
      position: 'fixed inset-0',
      display: 'flex',
      padding: 'p-5',
      overflow: 'overflow-y-auto',
      bg: 'bg-black/25 dark:bg-black/50',
    },
    customBackdropClassNames
  );

  const panelClassName = groupedClassNames(
    {
      margin: 'm-auto',
      width: 'max-w-md w-full',
      before: 'relative before:absolute before:inset-0 before:-z-10',
      blur: 'before:backdrop-blur-lg', // Workaround for Chromium Issue 993644
      shadow: 'before:shadow-dialog',
      rounded: 'before:rounded-2xl',
      padding: 'p-5',
      bg: 'before:bg-plain-100/90 before:dark:bg-plain-800/90',
      ringOffset: 'ring-offset-plain-100 dark:ring-offset-plain-800',
    },
    customPanelClassNames
  );

  if (!open) return null;

  return (
    <ModalRoot open={open} onClose={onClose}>
      <div className={backdropClassName} data-focus-trap="true">
        <ModalPanel
          className={panelClassName}
          onClick={(event) => event.stopPropagation()}
          children={children}
        />
      </div>
    </ModalRoot>
  );
};
