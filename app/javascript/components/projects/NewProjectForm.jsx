import React from 'react'
import { useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import EventDelegateContext from 'lib/contexts/EventDelegateContext'
import RouteConfig from 'lib/RouteConfig'
import ProjectsAPI from 'lib/resources/ProjectsAPI'
import ProjectForm from 'components/projects/ProjectForm'

const NewProjectForm = withRouter(props => {
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const eventDelegate = useContext(EventDelegateContext)
  
  const handleSubmit = project => {
    if (!isUploading) {
      setIsUploading(true)

      ProjectsAPI.create(project)
        .then(project => {
          setErrors({})
          props.onComplete()
          eventDelegate.reloadProjects()
          props.history.push(RouteConfig.projects.show(project.id).url)
        })
        .catch(error => {
          if (error.notOkayStatus && error.response.statusText === 'Unprocessable Entity') {
            error.response.json()
              .then(setErrors)
          } else {
            console.error(error)
          }

          setIsUploading(false)
        })
    }
  }

  return (
    <ProjectForm
      initialProject={{}}
      submitButtonLabel="Create Project"
      onSubmit={handleSubmit}
      disabled={isUploading}
      errors={errors} />
  )
})

export default NewProjectForm
