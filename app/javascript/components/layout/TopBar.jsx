import React from 'react'
import { LayoutSidebar } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import NewDocumentButton from 'components/layout/NewDocumentButton'

const TopBar = props => {
  const { sendSidebarEvent } = useContext()

  return (
    <nav
      id="top-bar"
      className="layout-row navbar navbar-light border-bottom p-2 gap-3"
      style={{ zIndex: 1030 }}>
      <button
        type="button"
        id="toggle-sidebar-button"
        className="focus-target btn btn-icon btn-icon-inline text-secondary"
        title="Toggle sidebar"
        onClick={() => sendSidebarEvent.invoke('toggle')}>
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
