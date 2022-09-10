import React from 'react'

import { useContext } from '~/lib/context'
import ProjectsAPI from '~/lib/resources/ProjectsAPI'

import ProjectForm from '~/components/projects/ProjectForm'

const NewProjectForm = props => {
  const { reloadProjects } = useContext()

  return (
    <ProjectForm
      initialProject={{}}
      submitButtonLabel="Create Project"
      action={project => ProjectsAPI.create(project)}
      onComplete={project => {
        reloadProjects()
        props.onComplete?.(project)
      }}
      autoFocus={props.autoFocus} />
  )
}

export default NewProjectForm
