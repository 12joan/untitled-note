import React from 'react'
import { useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { useContext } from '~/lib/context'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'

import Modal from '~/components/Modal'

const NewProjectModal = withRouter(props => {
  const { project, reloadProjects, setParams } = useContext()

  const modal = useRef(null)

  const [deleting, setDeleting] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  const onShow = event => {
    setConfirmation(false)
  }

  const performDeletion = () => {
    const currentModal = modal.current

    setDeleting(true)

    ProjectsAPI.destroy(project)
      .then(() => {
        currentModal.hide()
        reloadProjects()
        setParams({ projectId: undefined, keywordId: undefined, documentId: undefined })
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
                checked={confirmation}
                onChange={event => setConfirmation(event.target.checked)}
                id="confirm-deletion-checkbox" />

              <label className="form-check-label" htmlFor="confirm-deletion-checkbox">
                Delete <strong>{project.name}</strong> and all its documents
              </label>
            </div>

            <button
              type="button"
              className="btn btn-lg btn-danger w-100"
              disabled={!confirmation || deleting}
              onClick={performDeletion}>
              Delete Project
            </button>
          </>
        )
      }
    </Modal>
  )
})

export default NewProjectModal
