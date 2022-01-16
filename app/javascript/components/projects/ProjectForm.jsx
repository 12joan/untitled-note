import React from 'react'
import { useState } from 'react'

import { useContext } from 'lib/context'

const ProjectForm = props => {
  const [name, setName] = useState(props.initialProject.name || '')

  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = event => {
    event.preventDefault()

    if (isUploading) {
      return
    }

    setIsUploading(true)

    const project = {
      ...props.initialProject,
      name,
    }

    props.action(project)
      .then(project => {
        setErrors({})
        props.onComplete?.(project)
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-floating mb-3">
        <input
          id="project-name"
          type="text"
          className={`form-control ${errors['name'] === undefined ? '' : 'is-invalid'}`}
          placeholder="Project Name"
          disabled={isUploading}
          value={name}
          onChange={event => setName(event.target.value)}
          autoFocus />

        <label htmlFor="project-name">
          Project Name
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-lg btn-primary w-100"
        disabled={isUploading}>
        {props.submitButtonLabel}
      </button>
    </form>
  )
}

export default ProjectForm
