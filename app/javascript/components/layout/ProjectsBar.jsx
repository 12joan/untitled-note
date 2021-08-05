import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'
import ProjectsAPI from 'lib/resources/ProjectsAPI'

const ProjectsBar = props => {
  const currentProjectId = useContext(ProjectContext)

  const [projects, setProjects] = useState(undefined)

  useEffect(() => ProjectsAPI.index().then(setProjects), [])

  return (
    <div className="h-100 border-end p-3">
      {
        projects === undefined
          ? <>Loading&hellip;</>
          : projects.map(project => {
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
