import React from 'react'

import ProjectsAPI from 'lib/resources/ProjectsAPI'

import ProjectForm from 'components/projects/ProjectForm'

const NewProjectForm = props => {
  return (
    <ProjectForm
      initialProject={{}}
      submitButtonLabel="Create Project"
      action={project => ProjectsAPI.create(project)}
      onComplete={props.onComplete} />
  )
}

export default NewProjectForm
