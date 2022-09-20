import React from 'react'
import { Dialog } from '@headlessui/react'

import { ContextProvider } from '~/lib/context'

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

const ModalPanel = Dialog.Panel
const ModalDescription = Dialog.Description

export {
  ModalRoot,
  ModalPanel,
  ModalTitle,
  ModalDescription,
}
