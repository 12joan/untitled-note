import React from 'react'
import { useRef } from 'react'
import useRemountKey from 'lib/useRemountKey'
import Modal from 'components/Modal'
import NewProjectForm from 'components/projects/NewProjectForm'

const NewProjectModal = props => {
  const modal = useRef(null)

  const [formKey, remountForm] = useRemountKey()

  return (
    <Modal
      ref={modal}
      id="new-project-modal"
      title="New Project"
      onShow={remountForm}>
      <NewProjectForm
        key={formKey}
        onComplete={() => modal.current.hide()} />
    </Modal>
  )
}

export default NewProjectModal
