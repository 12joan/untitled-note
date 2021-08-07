import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'

const ProjectsBar = props => {
  const currentProjectId = useContext(ProjectContext)

  return (
    <div className="h-100 border-end p-3">
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#new-project-modal">New</button>

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
