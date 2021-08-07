import React from 'react'
import { useRef, useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import Modal from 'components/Modal'
import EventDelegateContext from 'lib/contexts/EventDelegateContext'
import RouteConfig from 'lib/RouteConfig'
import ProjectsAPI from 'lib/resources/ProjectsAPI'

const NewProjectModal = withRouter(props => {
  const eventDelegate = useContext(EventDelegateContext)

  const modal = useRef(null)

  const [project, setProject] = useState(undefined)
  const [deleting, setDeleting] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  const onShow = event => {
    const project = JSON.parse(event.relatedTarget.getAttribute('data-bs-project'))
    setProject(project)
    setConfirmation(false)
  }

  const performDeletion = () => {
    setDeleting(true)

    ProjectsAPI.destroy(project)
      .then(() => {
        modal.current.hide()
        props.history.push(RouteConfig.rootUrl)
        eventDelegate.reloadProjects()
      })
      .catch(error => {
        console.error(error)
        setDeleting(false)
      })
  }

  return (
    <Modal
      ref={modal}
      id="delete-project-modal"
      title="Confirm Deletion"
      onShow={onShow}>
      {
        project !== undefined && (
          <>
            <p className="mb-3 text-danger">
              The project <strong>{project.name}</strong> and all associated documents will be permanently deleted.
            </p>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                value={confirmation}
                onChange={event => setConfirmation(event.target.checked)}
                id="confirm-deletion-checkbox" />

              <label className="form-check-label" htmlFor="confirm-deletion-checkbox">
                Delete <strong>{project.name}</strong> and all its documents
              </label>
            </div>

            <div className="mb-3">
              <button
                type="button"
                className="btn btn-danger"
                disabled={!confirmation || deleting}
                onClick={performDeletion}>
                Delete Project
              </button>
            </div>
          </>
        )
      }
    </Modal>
  )
})

export default NewProjectModal
