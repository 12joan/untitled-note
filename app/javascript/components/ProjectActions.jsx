import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useContext } from '~/lib/context'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'
import openModal from '~/lib/openModal'
import awaitRedirect from '~/lib/awaitRedirect'
import pluralize from '~/lib/pluralize'
import { handleDeleteProjectError } from '~/lib/handleErrors'
import { removeProjectFromHistory } from '~/lib/projectHistory'

import { ModalTitle } from '~/components/Modal'
import { InlinePlaceholder } from '~/components/Placeholder'

const ProjectActions = () => {
  const { project, futurePartialDocuments } = useContext()
  const futureDocumentCount = futurePartialDocuments.map(xs => xs.length)

  const navigate = useNavigate()
  const { pathname: currentPath } = useLocation()

  const handleDelete = () => openModal(
    ConfirmDeletionModal,
    { project, futureDocumentCount },
    () => awaitRedirect({
      navigate,
      promisePath: handleDeleteProjectError(
        ProjectsAPI.destroy(project)
      ).then(() => {
        removeProjectFromHistory(project.id)
        return '/'
      }),
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

const ConfirmDeletionModal = ({ onConfirm, onClose, project, futureDocumentCount }) => {
  const [areYouSure, setAreYouSure] = useState(false)

  return (
    <div className="space-y-5">
      <ModalTitle>Delete project</ModalTitle>

      {futureDocumentCount.map(documentCount => (
        documentCount === 0
          ? (
            <p><strong>{project.name}</strong> contains no documents.</p>
          )
          : (
            <p><strong>{project.name}</strong> contains {pluralize(documentCount, 'document')}, which will also be deleted.</p>
          )
      )).orDefault(<InlinePlaceholder className="bg-white dark:bg-black" />)}

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

export default ProjectActions
