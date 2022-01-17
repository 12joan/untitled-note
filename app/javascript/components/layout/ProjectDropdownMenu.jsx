import React from 'react'

const ProjectDropdownMenu = props => {
  return (
    <div className="dropdown">
      {props.children}

      <ul className="dropdown-menu" aria-labelledby="project-dropdown-button">
        <li>
          <button
            type="button"
            className="dropdown-item"
            data-bs-toggle="modal"
            data-bs-target="#edit-project-modal">
            Edit project
          </button>
        </li>

        <li>
          <button
            type="button"
            className="dropdown-item dropdown-item-danger"
            data-bs-toggle="modal"
            data-bs-target="#delete-project-modal">
            Delete project
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ProjectDropdownMenu
