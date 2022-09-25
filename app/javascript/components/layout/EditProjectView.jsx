import React, { useState } from 'react'

import { useContext } from '~/lib/context'
import { FutureServiceResult } from '~/lib/future'
import useNormalizedInput from '~/lib/useNormalizedInput'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'

import BackButton from '~/components/BackButton'
import SpinnerIcon from '~/components/icons/SpinnerIcon'

const EditProjectView = () => {
  const { futureProject } = useContext()

  return (
    <div className="narrow">
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">Edit project</h1>

      {futureProject.unwrap({
        pending: () => <div>Loading...</div>,
        resolved: project => (
          <ProjectForm initialProject={project} />
        ),
      })}
    </div>
  )
}

const ProjectForm = ({ initialProject }) => {
  const [savingState, setSavingState] = useState(() => FutureServiceResult.success())
  const [name, nameProps] = useNormalizedInput(initialProject.name, name => name.trim())

  const handleSubmit = event => {
    event.preventDefault()

    setSavingState(FutureServiceResult.pending())

    FutureServiceResult.fromPromise(
      ProjectsAPI.update({
        id: initialProject.id,
        name,
      }).catch(error => {
        console.error(error)
        throw error
      }),
      // If the update occurs near-instantaneously,
      // the user may be unsure if it was successful
      result => setTimeout(() => setSavingState(result), 100)
    )
  }

  return (
    <>
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

        {savingState.unwrap({
          failure: error => (
            <div className="text-red-500" aria-live="polite">
              An error occurred while saving the project. Make sure you're connected to the internet and try again.
            </div>
          ),
        })}

        <button
          type="submit"
          className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800"
          disabled={savingState.isPending}
        >
          {savingState.isPending
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
    </>
  )
}

export default EditProjectView
