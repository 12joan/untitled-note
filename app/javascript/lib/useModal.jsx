import React, { useState } from 'react'

import groupedClassNames from '~/lib/groupedClassNames'

import { ModalRoot, ModalPanel } from '~/components/Modal'

const useModal = (ModalComponent, wrapperProps = {}) => {
  const [componentProps, setComponentProps] = useState(null)
  const open = componentProps !== null
  const openModal = (componentProps = {}) => setComponentProps(componentProps)
  const closeModal = () => setComponentProps(null)
  const toggleModal = () => setComponentProps(oldProps => oldProps === null ? {} : null)

  const modal = (
    <Modal open={open} onClose={closeModal} {...wrapperProps}>
      {open && (
        <ModalComponent {...componentProps} onClose={closeModal} />
      )}
    </Modal>
  )

  return [modal, openModal, closeModal, toggleModal]
}

const Modal = ({ open, children, onClose, customBackdropClassNames, customPanelClassNames }) => {
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
    blur: 'backdrop-blur-lg',
    shadow: 'shadow-dialog',
    rounded: 'rounded-2xl',
    padding: 'p-5',
    bg: 'bg-slate-100/90 dark:bg-slate-800/90',
    ringOffset: 'ring-offset-slate-100 dark:ring-offset-slate-800',
  }, customPanelClassNames)

  return open && (
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

export default useModal
