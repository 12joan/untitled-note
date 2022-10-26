import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useModal from '~/lib/useModal'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import { projectPath } from '~/lib/routes'
import awaitRedirect from '~/lib/awaitRedirect'
import useNormalizedInput from '~/lib/useNormalizedInput'
import { handleCreateProjectError } from '~/lib/handleErrors'

import { ModalTitle } from '~/components/Modal'

const useNewProject = () => {
  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()
  const { invalidateProjectsCache } = useContext()

  const [modalPortal, openModal] = useModal(NewProjectModal)

  const openNewProjectModal = () => openModal({
    onConfirm: projectArgs => awaitRedirect({
      navigate,
      promisePath: handleCreateProjectError(
        ProjectsAPI.create(projectArgs)
      ).then(({ id }) => {
        invalidateProjectsCache()
        return projectPath(id)
      }),
      fallbackPath: currentPath,
    }),
  })

  return [modalPortal, openNewProjectModal]
}

const NewProjectModal = ({ onConfirm, onClose }) => {
  const { value: name, props: nameProps } = useNormalizedInput({
    initial: '',
    normalize: name => name.trim(),
  })

  const handleSubmit = event => {
    event.preventDefault()
    onClose()
    onConfirm({ name })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ModalTitle>New project</ModalTitle>

      <label className="block space-y-2">
        <div className="font-medium select-none">Project name</div>

        <input
          type="text"
          {...nameProps}
          required
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="My Project"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button type="button" className="btn btn-rect btn-modal-secondary" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="btn btn-rect btn-primary">
          Create project
        </button>
      </div>
    </form>
  )
}

export default useNewProject
