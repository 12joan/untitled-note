import React from 'react'
import { Dialog } from '@headlessui/react'

import { ContextProvider } from '~/lib/context'

import WithCloseButton from '~/components/WithCloseButton'

const ModalRoot = ({ open, onClose, className: userClassName = '', ...otherProps }) => {
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

const ModalTitle = ({ children }) => {
  return (
    <Dialog.Title
      className="text-xl font-medium select-none"
      children={children}
    />
  )
}

const ModalTitleWithCloseButton = ({ onClose, children }) => {
  return (
    <WithCloseButton onClose={onClose}>
      <ModalTitle children={children} />
    </WithCloseButton>
  )
}

const ModalPanel = Dialog.Panel
const ModalDescription = Dialog.Description

export {
  ModalRoot,
  ModalPanel,
  ModalTitle,
  ModalTitleWithCloseButton,
  ModalDescription,
}
