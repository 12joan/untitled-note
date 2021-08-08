import React from 'react'
import { PencilSquare } from 'react-bootstrap-icons'

import NavLink from 'components/NavLink'

const TopBar = props => {
  return (
    <nav className="navbar navbar-light border-bottom d-flex justify-content-end p-2">
      <NavLink
        className="btn btn-dark"
        params={{ documentId: 'new' }}>
        <PencilSquare className="bi" /> New document
      </NavLink>
    </nav>
  )
}

export default TopBar
