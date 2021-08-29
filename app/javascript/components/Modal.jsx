import React from 'react'
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal as BootstrapModal } from 'bootstrap'

import useRemountKey from 'lib/useRemountKey'

const Modal = forwardRef((props, ref) => {
  const { id, title, children, onShow, ...otherProps } = props

  const modalEl = useRef(null)

  const [modalObject, setModalObject] = useState()

  useEffect(() => {
    setModalObject(new BootstrapModal(modalEl.current))
    modalEl.current.addEventListener('shown.bs.modal', event => onShow?.(event))
  }, [])

  useImperativeHandle(ref, () => ({
    hide: () => modalObject.hide(),
  }))

  return (
    <div ref={modalEl} id={id} className="modal fade" tabIndex="-1" {...otherProps}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-lg p-lg">
          <div className="modal-header border-0 p-0 mb-2">
            <h1 className="modal-title h2">
              {title}
            </h1>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close" />
          </div>

          <div className="modal-body p-0 mb-n3">
            {children}
          </div>
        </div>
      </div>
    </div>

  )
})

export default Modal
