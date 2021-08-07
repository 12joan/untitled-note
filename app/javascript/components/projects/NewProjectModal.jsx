import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Modal } from 'bootstrap'
import NewProjectForm from 'components/projects/NewProjectForm'

const NewProjectModal = props => {
  const modalEl = useRef(null)

  const [modalObject, setModalObject] = useState()

  useEffect(() => {
    setModalObject(new Modal(modalEl.current))
  }, [])

  return (
    <div ref={modalEl} id="new-project-modal" className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-lg p-lg">
          <div className="modal-header border-0 p-0">
            <h1 className="modal-title">
              New Project
            </h1>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close" />
          </div>

          <div className="modal-body p-0 pt-3 mb-n3">
            <NewProjectForm
              onComplete={() => modalObject.hide()} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default NewProjectModal
