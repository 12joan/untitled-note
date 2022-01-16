import React from 'react'
import { PlusLg as Plus } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import classList from 'lib/classList'

const ProjectsBar = props => {
  const { project: currentProject, projects, setParams } = useContext()

  return (
    <div className="h-100 overflow-auto p-3">
      <div className="layout-row align-items-center mb-2 gap-2">
        <h6 className="small text-secondary m-0">Projects</h6>

        <div className="ms-auto">
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

      {
        projects.map(project => {
          const isCurrent = currentProject.id === project.id

          return (
            <div key={project.id} className="d-grid mb-2">
              <button
                type="button"
                className={classList(['btn btn-project', { selected: isCurrent }])}
                onClick={() => !isCurrent && setParams({ projectId: project.id, keywordId: undefined, documentId: undefined })}
                data-bs-target="#sidebar-carousel"
                data-bs-slide-to="1">
                {project.name}
              </button>
            </div>
          )
        })
      }
    </div>
  )
}

export default ProjectsBar
