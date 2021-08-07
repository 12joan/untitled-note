import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { PlusLg as Plus } from 'react-bootstrap-icons'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'

const ProjectsBar = props => {
  const { id: currentProjectId } = useContext(ProjectContext)

  return (
    <div className="h-100 border-end p-3" style={{ width: '12em' }}>
      <div className="container-fluid mb-2">
        <div className="row gx-3 align-items-center">
          <div className="col">
            <h6 className="small text-secondary m-0">Projects</h6>
          </div>

          <div className="col-auto">
            <button
              className="btn btn-sm btn-icon text-secondary"
              data-bs-toggle="modal"
              data-bs-target="#new-project-modal"
              title="New Project">
              <Plus className="bi" />
              <span className="visually-hidden">New Project</span>
            </button>
          </div>
        </div>
      </div>

      {
        props.projects.map(project => {
          const isCurrent = currentProjectId === project.id

          return (
            <div key={project.id} className="d-grid mb-2">
              <NavLink
                to={RouteConfig.projects.show(project.id).url}
                className={`btn btn-project`}
                activeClassName="selected">
                {project.name}
              </NavLink>
            </div>
          )
        })
      }
    </div>
  )
}

export default ProjectsBar
