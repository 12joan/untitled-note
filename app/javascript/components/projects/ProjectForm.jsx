import React from 'react'
import { useState } from 'react'

const ProjectForm = props => {
  const [name, setName] = useState(props.initialProject.name || '')

  const handleSubmit = event => {
    event.preventDefault()

    props.onSubmit({
      ...props.initialProject,
      name,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-floating mb-3">
        <input
          id="project-name"
          type="text"
          className={`form-control ${props.errors['name'] === undefined ? '' : 'is-invalid'}`}
          placeholder="Project Name"
          disabled={props.disabled}
          value={name}
          onChange={event => setName(event.target.value)} />

        <label htmlFor="project-name">
          Project Name
        </label>
      </div>

      <div className="mb-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={props.disabled}>
          {props.submitButtonLabel}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
