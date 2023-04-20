import React from 'react'
import { Dialog } from '@headlessui/react'

import { ContextProvider } from '~/lib/context'

import WithCloseButton from '~/components/WithCloseButton'

export const ModalRoot = ({ open, onClose, className: userClassName = '', ...otherProps }) => {
  const className = `${userClassName} modal-root relative z-30 ${open ? '' : 'pointer-events-none'}`

  return (
    <ContextProvider inModal={true}>
      <Dialog
        static
        open={open}
        onClose={onClose}
        className={className}
        aria-hidden={!open}
        {...otherProps}
      />
    </ContextProvider>
  )
}

export const ModalTitle = ({ children }) => {
  return (
    <Dialog.Title
      className="text-xl font-medium select-none"
      children={children}
    />
  )
}

export const ModalTitleWithCloseButton = ({ onClose, children }) => {
  return (
    <WithCloseButton onClose={onClose}>
      <ModalTitle children={children} />
    </WithCloseButton>
  )
}

export const ModalPanel = Dialog.Panel

export export interface StyledModalProps {
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
}: ModalProps) => {
  const backdropClassName = groupedClassNames({
    position: 'fixed inset-0',
    display: 'flex',
    padding: 'p-5',
    overflow: 'overflow-y-auto',
    bg: 'bg-black/25 dark:bg-black/50',
  }, customBackdropClassNames)

  const panelClassName = groupedClassNames({
    margin: 'm-auto',
    width: 'max-w-md w-full',
    before: 'relative before:absolute before:inset-0 before:-z-10',
    blur: 'before:backdrop-blur-lg', // Workaround for Chromium Issue 993644
    shadow: 'before:shadow-dialog',
    rounded: 'before:rounded-2xl',
    padding: 'p-5',
    bg: 'before:bg-slate-100/90 before:dark:bg-slate-800/90',
    ringOffset: 'ring-offset-slate-100 dark:ring-offset-slate-800',
  }, customPanelClassNames)

  if (!open) return null;

  return (
    <ModalRoot open={open} onClose={onClose}>
      <div className={backdropClassName} data-focus-trap="true">
        <ModalPanel
          className={panelClassName}
          onClick={event => event.stopPropagation()}
          children={children}
        />
      </div>
    </ModalRoot>
  )
}
