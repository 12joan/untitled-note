import React from 'react'
import { LayoutSidebar, QuestionLg } from 'react-bootstrap-icons'

import { useContext } from '~/lib/context'

import SearchBar from '~/components/layout/SearchBar'
import NewDocumentButton from '~/components/layout/NewDocumentButton'

const TopBar = props => {
  const { project, sendSidebarEvent } = useContext()

  return (
    <nav
      id="top-bar"
      className="layout-row navbar navbar-light flex-nowrap justify-content-start align-items-center border-bottom gap-2 px-2"
      style={{ zIndex: 1030 }}>
      <button
        type="button"
        id="toggle-sidebar-button"
        className="focus-target btn btn-icon btn-icon-inline"
        title="Toggle sidebar"
        onClick={() => sendSidebarEvent.invoke('toggle')}>
        <LayoutSidebar className="bi" />
        <span className="visually-hidden">Toggle sidebar</span>
      </button>

      <button
        type="button"
        id="all-projects-link"
        className="btn btn-link text-decoration-none dropdown-toggle text-truncate"
        style={{ fontWeight: 500 }}
        data-bs-toggle="modal"
        data-bs-target="#switch-project-modal">
        {project.name}
      </button>

      <div className="flex-grow-1 ms-auto" style={{ minWidth: '120px', maxWidth: '720px' }}>
        <SearchBar />
      </div>

      <div className="ms-auto layout-row justify-content-end gap-2">
        <button
          type="button"
          id="keyboard-navigation-button"
          className="btn btn-light btn-circle"
          data-bs-toggle="modal"
          data-bs-target="#keyboard-navigation-modal">
          <span aria-hidden>?</span>
          <span className="visually-hidden">Keyboard Navigation</span>
        </button>

        <NewDocumentButton />
      </div>
    </nav>
  )
}

export default TopBar
