import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useContext } from '~/lib/context'
import { sequence, Future, FutureServiceResult } from '~/lib/future'
import useNormalizedInput from '~/lib/useNormalizedInput'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import openModal from '~/lib/openModal'
import awaitRedirect from '~/lib/awaitRedirect'
import pluralize from '~/lib/pluralize'
import { handleUpdateProjectError, handleDeleteProjectError } from '~/lib/handleErrors'

import BackButton from '~/components/BackButton'
import LoadingView from '~/components/LoadingView'
import SpinnerIcon from '~/components/icons/SpinnerIcon'
import { ModalTitle } from '~/components/Modal'

const EditProjectView = () => {
  const { futureProject, futurePartialDocuments } = useContext()

  const futures = sequence({
    project: futureProject,
    documentCount: futurePartialDocuments.map(xs => xs.length),
  }, Future.resolved)

  return (
    <div className="grow narrow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">Edit project</h1>

      {futures.unwrap({
        pending: () => <LoadingView />,
        resolved: ({ project, documentCount }) => (
          <div className="space-y-10">
            <ProjectForm initialProject={project} />
            <ProjectActions project={project} documentCount={documentCount} />
          </div>
        ),
      })}
    </div>
  )
}

const ProjectForm = ({ initialProject }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [name, nameProps] = useNormalizedInput(initialProject.name, name => name.trim())

  const handleSubmit = event => {
    event.preventDefault()

    setIsSaving(true)

    handleUpdateProjectError(
      ProjectsAPI.update({
        id: initialProject.id,
        name,
      })
    ).finally(() => setTimeout(() => setIsSaving(false), 100))
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <div className="font-medium select-none">Project name</div>

        <input
          type="text"
          {...nameProps}
          required
          className="block w-full border rounded-lg px-3 py-2 bg-page-bg-light dark:bg-page-bg-dark"
          placeholder="My Project"
        />
      </label>

      <button
        type="submit"
        className="block px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-page-bg-light dark:ring-offset-page-bg-dark"
        disabled={isSaving}
      >
        {isSaving
          ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon size="1.25em" className="animate-spin" noAriaLabel />
              Saving...
            </span>
          )
          : 'Save changes'
        }
      </button>
    </form>
  )
}

const ProjectActions = ({ project, documentCount }) => {
  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()

  const handleDelete = () => openModal(
    ConfirmDeletionModal,
    { project, documentCount },
    () => awaitRedirect({
      navigate,
      promisePath: handleDeleteProjectError(
        ProjectsAPI.destroy(project)
      ).then(() => '/'),
      fallbackPath: currentPath,
    })
  )

  return (
    <div>
      <h2 className="text-2xl font-medium select-none mb-3">Other actions</h2>

      <div className="border rounded-lg flex flex-col sm:flex-row gap-3 p-3 sm:items-center">
        <div className="space-y-1 grow select-none">
          <strong className="font-medium">Delete this project</strong>
          <p className="text-slate-500 dark:text-slate-400">Deleting a project is permanent and cannot be undone.</p>
        </div>

        <button
          type="button"
          className="shrink-0 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-500 dark:text-red-400"
          onClick={handleDelete}
        >
          Delete project
        </button>
      </div>
    </div>
  )
}

const ConfirmDeletionModal = ({ onConfirm, onClose, project, documentCount }) => {
  const [areYouSure, setAreYouSure] = useState(false)

  return (
    <div className="space-y-5">
      <ModalTitle>Delete project</ModalTitle>

      {documentCount === 0
        ? (
          <p><strong>{project.name}</strong> contains no documents.</p>
        )
        : (
          <p><strong>{project.name}</strong> contains {pluralize(documentCount, 'document')}, which will also be deleted.</p>
        )
      }

      <label className="flex gap-2 items-start">
        <input
          type="checkbox"
          className="ring-offset-slate-100 dark:ring-offset-slate-800"
          checked={areYouSure}
          onChange={event => setAreYouSure(event.target.checked)}
        />

        <span className="select-none">I understand that this action is permanent and cannot be undone.</span>
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
          type="button"
          className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onConfirm}
          disabled={!areYouSure}
        >
          Delete project
        </button>
      </div>
    </div>
  )
}

export default EditProjectView
