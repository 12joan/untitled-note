import React from 'react'
import { Link } from 'react-router-dom'
import { PencilSquare } from 'react-bootstrap-icons'

const TopBar = props => (
  <nav className="navbar navbar-light border-bottom d-flex justify-content-end p-2">
    <Link to="/documents/new" className="btn btn-dark">
      <PencilSquare className="bi" /> New document
    </Link>
  </nav>
)

export default TopBar
