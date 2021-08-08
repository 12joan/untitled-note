import React from 'react'
import { ThreeDots } from 'react-bootstrap-icons'

const ProjectDropdownMenu = props => {
  return (
    <div className="dropdown">
      <button
        type="button"
        id="project-dropdown-button"
        className="btn btn-icon text-secondary"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <ThreeDots className="bi" />
        <span className="visually-hidden">Toggle dropdown</span>
      </button>

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
