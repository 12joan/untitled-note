import React from 'react'
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal as BootstrapModal } from 'bootstrap'

import useRemountKey from 'lib/useRemountKey'
import classList from 'lib/classList'

const Modal = forwardRef((props, ref) => {
  const { id, title, centered, children, onShow, ...otherProps } = props

  const modalEl = useRef(null)

  const [modalObject, setModalObject] = useState()

  useEffect(() => {
    setModalObject(new BootstrapModal(modalEl.current))
    modalEl.current.addEventListener('shown.bs.modal', event => {
      modalEl.current.querySelector('[autofocus]')?.focus?.()
      onShow?.(event)
    })
  }, [])

  useImperativeHandle(ref, () => ({
    hide: () => modalObject.hide(),
  }))

  return (
    <div ref={modalEl} id={id} className="modal" tabIndex="-1" {...otherProps}>
      <div className={classList(["modal-dialog", { 'modal-dialog-centered' : centered }])}>
        <div className="modal-content overflow-hidden border-0 shadow" style={{ borderRadius: '0.75rem' }}>
          <div className="modal-header border-0 p-4 pb-3">
            <h2 className="fw-bold mb-0">{title}</h2>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close" />
          </div>

          <div className="modal-body p-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
})

Modal.defaultProps = {
  centered: true,
}

export default Modal
