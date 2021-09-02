import React from 'react'
import { LayoutSidebar } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import NewDocumentButton from 'components/layout/NewDocumentButton'

const TopBar = props => {
  const { toggleSidebarEvent } = useContext()

  return (
    <nav
      id="top-bar"
      className="focusable navbar navbar-light bg-white border-bottom d-flex p-2 gap-3"
      tabIndex="0"
      style={{ zIndex: 1030 }}>
      <button
        type="button"
        id="toggle-sidebar-button"
        className="btn btn-lg btn-icon btn-icon-inline text-secondary"
        title="Toggle sidebar"
        onClick={toggleSidebarEvent.invoke}>
        <LayoutSidebar className="bi" />
        <span className="visually-hidden">Toggle sidebar</span>
      </button>

      <button
        type="button"
        id="keyboard-navigation-button"
        className="btn btn-light rounded-pill visually-hidden-focusable"
        data-bs-toggle="modal"
        data-bs-target="#keyboard-navigation-modal">
        Keyboard Navigation
      </button>

      <div className="ms-auto">
        <NewDocumentButton />
      </div>
    </nav>
  )
}

export default TopBar
