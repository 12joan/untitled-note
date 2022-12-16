import React from 'react'
import { Dialog } from '@headlessui/react'

import { ContextProvider } from '~/lib/context'

import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

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
    <div className="flex items-center justify-between gap-2">
      <ModalTitle children={children} />

      <button
        type="button"
        className="btn btn-no-rounded rounded-full p-2 aspect-square"
        onClick={onClose}
      >
        <LargeCloseIcon size="1.25em" ariaLabel="Close" />
      </button>
    </div>
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
