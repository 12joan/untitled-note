import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Modal } from 'bootstrap'
import useRemountKey from 'lib/useRemountKey'
import EditProjectForm from 'components/projects/EditProjectForm'

const EditProjectModal = props => {
  const modalEl = useRef(null)

  const [modalObject, setModalObject] = useState()
  const [initialProject, setInitialProject] = useState(undefined)
  const [formKey, remountForm] = useRemountKey()

  useEffect(() => {
    setModalObject(new Modal(modalEl.current))

    modalEl.current.addEventListener('show.bs.modal', event => {
      const project = JSON.parse(event.relatedTarget.getAttribute('data-bs-project'))
      setInitialProject(project)
      remountForm()
    })
  }, [])

  return (
    <div ref={modalEl} id="edit-project-modal" className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-lg p-lg">
          <div className="modal-header border-0 p-0">
            <h1 className="modal-title">
              Edit Project
            </h1>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close" />
          </div>

          <div className="modal-body p-0 pt-3 mb-n3">
            {
              initialProject !== undefined && (
                <EditProjectForm
                  key={formKey}
                  project={initialProject}
                  onComplete={() => modalObject.hide()} />
              )
            }
          </div>
        </div>
      </div>
    </div>

  )
}

export default EditProjectModal
