import React from 'react'
import { LayoutSidebar } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import NewDocumentButton from 'components/layout/NewDocumentButton'

const TopBar = props => {
  const { toggleSidebarEvent } = useContext()

  return (
    <nav
      className="navbar navbar-light bg-white border-bottom d-flex p-2"
      style={{ zIndex: 1030 }}>
      <button
        type="button"
        className="btn btn-lg btn-icon btn-icon-inline text-secondary"
        title="Toggle sidebar"
        onClick={toggleSidebarEvent.invoke}>
        <LayoutSidebar className="bi" />
        <span className="visually-hidden">Toggle sidebar</span>
      </button>

      <div className="ms-auto">
        <NewDocumentButton />
      </div>
    </nav>
  )
}

export default TopBar
