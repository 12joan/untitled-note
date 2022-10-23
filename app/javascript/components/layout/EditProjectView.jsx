import React from 'react'

import { useContext } from '~/lib/context'
import useTitle from '~/lib/useTitle'

import BackButton from '~/components/BackButton'
import EditProjectName from '~/components/EditProjectName'
import EditProjectIcon from '~/components/EditProjectIcon'
import ProjectActions from '~/components/ProjectActions'

const EditProjectView = () => {
  const { project } = useContext()

  useTitle(`Edit ${project.name}`)

  return (
    <div className="grow narrow flex flex-col">
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


export default EditProjectView
