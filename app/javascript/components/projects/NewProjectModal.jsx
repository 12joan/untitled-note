import React from 'react'
import { useRef } from 'react'

import { useContext } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'

import Modal from 'components/Modal'
import NewProjectForm from 'components/projects/NewProjectForm'

const NewProjectModal = props => {
  const { setParams, reloadProjects } = useContext()

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
        onComplete={project => {
          modal.current.hide()
          setParams({ projectId: project.id, keywordId: undefined, documentId: undefined })
        }} />
    </Modal>
  )
}

export default NewProjectModal
