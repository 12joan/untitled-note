import React from 'react'
import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'

const NavigationMenu = props => {
  const projectId = useContext(ProjectContext)

  const documentsRoutes = RouteConfig.projects.show(projectId).documents

  return (
    <div className="h-100 border-end p-3" style={{ width: '12em' }}>
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
