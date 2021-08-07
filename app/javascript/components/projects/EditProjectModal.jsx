import React from 'react'
import { useRef, useState } from 'react'
import useRemountKey from 'lib/useRemountKey'
import Modal from 'components/Modal'
import EditProjectForm from 'components/projects/EditProjectForm'

const EditProjectModal = props => {
  const modal = useRef(null)

  const [formKey, remountForm] = useRemountKey()
  const [initialProject, setInitialProject] = useState(undefined)

  const onShow = event => {
    const project = JSON.parse(event.relatedTarget.getAttribute('data-bs-project'))
    setInitialProject(project)
    remountForm()
  }

  return (
    <Modal
      ref={modal}
      id="edit-project-modal"
      title="Edit Project"
      onShow={onShow}>
      {
        initialProject !== undefined && (
        <EditProjectForm
          key={formKey}
          project={initialProject}
          onComplete={() => modal.current.hide()} />
        )
      }
    </Modal>
  )
}

export default EditProjectModal
