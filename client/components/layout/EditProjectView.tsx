import React from 'react'

import { useContext } from '~/lib/context'
import { useTitle } from '~/lib/useTitle'
import { Project } from '~/lib/types'

import BackButton from '~/components/BackButton'
import { EditProjectName } from '~/components/EditProjectName'
import { EditProjectIcon } from '~/components/EditProjectIcon'
import { ProjectActions } from '~/components/ProjectActions'

export const EditProjectView = () => {
  const { project } = useContext() as { project: Project }

  useTitle(`Edit ${project.name}`)

  return (
    <div className="grow lg:narrow flex flex-col">
      <BackButton className="mb-3" />

      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="h1 select-none">Edit project</h1>

          <EditProjectName />
          <EditProjectIcon />
        </div>

        <ProjectActions />
      </div>
    </div>
  )
}
