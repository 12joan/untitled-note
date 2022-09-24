import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import { ModalRoot, ModalPanel } from '~/components/Modal'

const openModal = (Component, componentProps, onConfirm) => {
  const container = document.body

  const root = document.createElement('div')
  container.appendChild(root)

  const close = () => {
    unmountComponentAtNode(root)
    container.removeChild(root)
  }

  const confirmAndClose = data => {
    close()
    onConfirm(data)
  }

  render(
    <Modal onClose={close}>
      <Component
        onConfirm={confirmAndClose}
        onClose={close}
        {...componentProps}
      />
    </Modal>,
    root
  )
}

const Modal = ({ children, onClose }) => {
  return (
    <ModalRoot open={true} onClose={onClose}>
      <div className="fixed inset-0 flex p-5 overflow-y-auto">
        <ModalPanel
          className="m-auto bg-slate-100/75 backdrop-blur-xl shadow-dialog rounded-lg p-5 w-full max-w-md dark:bg-slate-800/75"
          onClick={event => event.stopPropagation()}
          children={children}
        />
      </div>
    </ModalRoot>
  )
}

export default openModal
