import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
// import { render, unmountComponentAtNode } from 'react-dom'

import useLazy from '~/lib/useLazy'

import { ModalRoot, ModalPanel } from '~/components/Modal'

// const openModal = (Component, componentProps, onConfirm) => {
//   const container = document.body
// 
//   const root = document.createElement('div')
//   container.appendChild(root)
// 
//   const close = () => {
//     unmountComponentAtNode(root)
//     container.removeChild(root)
//   }
// 
//   const confirmAndClose = data => {
//     close()
//     onConfirm(data)
//   }
// 
//   render(
//     <Modal onClose={close}>
//       <Component
//         onConfirm={confirmAndClose}
//         onClose={close}
//         {...componentProps}
//       />
//     </Modal>,
//     root
//   )
// }

const useModal = ModalComponent => {
  const container = useLazy(() => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    return container
  })

  useEffect(() => () => {
    document.body.removeChild(container)
  }, [])

  const [componentProps, setComponentProps] = useState(null)
  const openModal = (componentProps = {}) => setComponentProps(componentProps)
  const closeModal = () => setComponentProps(null)
  const open = componentProps !== null

  const portal = createPortal(
    <Modal open={open} onClose={closeModal}>
      {open && (
        <ModalComponent {...componentProps} onClose={closeModal} />
      )}
    </Modal>,
    container
  )

  return [portal, openModal]
}

const Modal = ({ open, children, onClose }) => {
  return open && (
    <ModalRoot open={open} onClose={onClose}>
      <div className="fixed inset-0 flex p-5 overflow-y-auto bg-black/25 dark:bg-black/50" data-focus-trap="true">
        <ModalPanel
          className="m-auto bg-slate-100/90 backdrop-blur-xl shadow-dialog rounded-2xl p-5 w-full max-w-md dark:bg-slate-800/90 descendants:ring-offset-slate-100 descendants:dark:ring-offset-slate-800"
          onClick={event => event.stopPropagation()}
          children={children}
        />
      </div>
    </ModalRoot>
  )
}

export default useModal
