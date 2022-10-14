import React from 'react'

import useTitle from '~/lib/useTitle'
import useNewProject from '~/lib/useNewProject'
import { LogoutLink } from '~/lib/routes'

const NoProjectsView = props => {
  useTitle('Create a project')

  const newProject = useNewProject()

  return (
    <div className="grow flex p-5">
      <div className="m-auto narrow space-y-3">
        <h1 className="text-3xl font-medium">Create a project</h1>

        <p className="text-lg font-light">You don't have any projects yet. Create one to get started.</p>

        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800 flex gap-2 items-center"
          onClick={newProject}
        >
          New project
        </button>

        <p><LogoutLink className="btn btn-link font-medium">Log out</LogoutLink></p>
      </div>
    </div>
  )
}

export default NoProjectsView
