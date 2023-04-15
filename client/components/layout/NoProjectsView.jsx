import React from 'react'

import useTitle from '~/lib/useTitle'
import useNewProject from '~/lib/useNewProject'
import { LogoutLink } from '~/lib/routes'

const NoProjectsView = props => {
  useTitle('Create a project')

  const [newProjectModal, openNewProjectModal] = useNewProject()

  return (
    <div className="grow flex p-5">
      {newProjectModal}

      <div className="m-auto lg:narrow space-y-3">
        <h1 className="h1">Create a project</h1>

        <p className="text-lg font-light">You don't have any projects yet. Create one to get started.</p>

        <button
          type="button"
          className="btn btn-rect btn-primary"
          onClick={openNewProjectModal}
        >
          New project
        </button>

        <p><LogoutLink className="btn btn-link font-medium">Log out</LogoutLink></p>
      </div>
    </div>
  )
}

export default NoProjectsView
