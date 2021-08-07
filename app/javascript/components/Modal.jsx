import React from 'react'
import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal as BootstrapModal } from 'bootstrap'
import useRemountKey from 'lib/useRemountKey'

const Modal = forwardRef((props, ref) => {
  const modalEl = useRef(null)

  const [modalObject, setModalObject] = useState()

  useEffect(() => {
    setModalObject(new BootstrapModal(modalEl.current))
    modalEl.current.addEventListener('show.bs.modal', event => props.onShow?.(event))
  }, [])

  useImperativeHandle(ref, () => ({
    hide: () => modalObject.hide(),
  }))

  return (
    <div ref={modalEl} id={props.id} className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-lg p-lg">
          <div className="modal-header border-0 p-0">
            <h1 className="modal-title">
              {props.title}
            </h1>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close" />
          </div>

          <div className="modal-body p-0 pt-3 mb-n3">
            {props.children}
          </div>
        </div>
      </div>
    </div>

  )
})

export default Modal
