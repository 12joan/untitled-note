import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ThreeDots } from 'react-bootstrap-icons'
import EventDelegateContext from 'lib/contexts/EventDelegateContext'
import RouteConfig from 'lib/RouteConfig'
import ProjectsAPI from 'lib/resources/ProjectsAPI'
import ProjectContext from 'lib/contexts/ProjectContext'

const NavigationMenu = props => {
  const eventDelegate = useContext(EventDelegateContext)
  const project = useContext(ProjectContext)

  const documentsRoutes = RouteConfig.projects.show(project.id).documents

  return (
    <div className="h-100 border-end p-3" style={{ width: '18em' }}>
      <div className="container-fluid mt-2 mb-3">
        <div className="row gx-3 align-items-center">
          <div className="col">
            <h2 className="fs-5 m-0">{project.name}</h2>
          </div>

          <div className="col-auto">
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
                    data-bs-target="#edit-project-modal"
                    data-bs-project={JSON.stringify(project)}>
                    Edit project
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="dropdown-item dropdown-item-danger"
                    onClick={() => {
                      ProjectsAPI.destroy(project)
                      eventDelegate.reloadProjects()
                    }}>
                    Delete project
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ul className="nav nav-pills flex-column">
        {
          [
            { path: documentsRoutes.url, text: 'All documents' },
          ].map(itemProps => <NavigationMenuItem key={itemProps.path} {...itemProps} />)
        }
      </ul>
    </div>
  )
}

const NavigationMenuItem = props => (
  <li className="nav-item">
    <NavLink
      to={props.path}
      className="nav-link rounded-0 mx-n3 px-3 py-1 text-start"
      activeClassName="active">
      {props.text}
    </NavLink>
  </li>
)

export default NavigationMenu
