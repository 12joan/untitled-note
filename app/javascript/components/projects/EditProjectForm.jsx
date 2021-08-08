import React from 'react'

import ProjectsAPI from 'lib/resources/ProjectsAPI'

import ProjectForm from 'components/projects/ProjectForm'

const EditProjectForm = props => {
  return (
    <ProjectForm
      initialProject={props.project}
      submitButtonLabel="Update Project"
      action={project => ProjectsAPI.update(project)}
      onComplete={props.onComplete} />
  )
}

export default EditProjectForm
