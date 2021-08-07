import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PencilSquare } from 'react-bootstrap-icons'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'

const TopBar = props => {
  const { id: projectId } = useContext(ProjectContext)

  const documentsRoutes = RouteConfig.projects.show(projectId).documents

  return (
    <nav className="navbar navbar-light border-bottom d-flex justify-content-end p-2">
      <Link to={documentsRoutes.new.url} className="btn btn-dark">
        <PencilSquare className="bi" /> New document
      </Link>
    </nav>
  )
}

export default TopBar
