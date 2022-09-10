import React from 'react'
import { useRef, useState } from 'react'

import { useContext } from '~/lib/context'
import useRemountKey from '~/lib/useRemountKey'

import Modal from '~/components/Modal'
import EditProjectForm from '~/components/projects/EditProjectForm'

const EditProjectModal = props => {
  const { project } = useContext()

  const modal = useRef(null)

  const [formKey, remountForm] = useRemountKey()

  const onShow = event => {
    remountForm()
  }

  return (
    <Modal
      ref={modal}
      id="edit-project-modal"
      title="Edit Project"
      onShow={onShow}>
      <EditProjectForm
        key={formKey}
        project={project}
        onComplete={() => modal.current.hide()} />
    </Modal>
  )
}

export default EditProjectModal
