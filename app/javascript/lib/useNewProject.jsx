import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useContext } from '~/lib/context'
import openModal from '~/lib/openModal'
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

  const openNewProjectModal = () => openModal(
    NewProjectModal,
    {},
    projectArgs => awaitRedirect({
      navigate,
      promisePath: handleCreateProjectError(
        ProjectsAPI.create(projectArgs)
      ).then(({ id }) => {
        invalidateProjectsCache()
        return projectPath(id)
      }),
      fallbackPath: currentPath,
    })
  )

  return openNewProjectModal
}

const NewProjectModal = ({ onConfirm, onClose }) => {
  const [name, nameProps] = useNormalizedInput({
    initial: '',
    normalize: name => name.trim(),
  })

  const handleSubmit = event => {
    event.preventDefault()
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
        <button
          type="button"
          className="px-6 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800"
        >
          Create project
        </button>
      </div>
    </form>
  )
}

export default useNewProject
