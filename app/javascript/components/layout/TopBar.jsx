import React, { forwardRef } from 'react'
import Tippy from '@tippyjs/react/headless'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'

import Tooltip from '~/components/Tooltip'
import SidebarIcon from '~/components/icons/SidebarIcon'
import MenuIcon from '~/components/icons/MenuIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'
import SettingsIcon from '~/components/icons/SettingsIcon'
import AccountIcon from '~/components/icons/AccountIcon'

/*import { LayoutSidebar, QuestionLg } from 'react-bootstrap-icons'


import SearchBar from '~/components/layout/SearchBar'
import NewDocumentButton from '~/components/layout/NewDocumentButton'*/

const TopBar = forwardRef(({ showSidebarButton, onSidebarButtonClick, ...otherProps }, ref) => {
  const { project } = useContext()
  const { isXs } = useBreakpoints()

  return (
    <nav
      ref={ref}
      className="fixed top-0 right-0 p-5 pointer-events-none flex items-center gap-2 z-10"
      {...otherProps}
    >
      {showSidebarButton && (
        <Tooltip content="Show sidebar">
          <button
            type="button"
            className="btn btn-transparent-blur rounded-full p-2 aspect-square pointer-events-auto"
            onClick={onSidebarButtonClick}
          >
            <SidebarIcon size="1.25em" ariaLabel="Show sidebar" />
          </button>
        </Tooltip>
      )}

      <div className={`font-medium ${showSidebarButton ? '' : '-ml-3'} px-3 py-1 rounded-full transparent-blur pointer-events-auto truncate`}>
        {project.name}
      </div>

      <div className="grow" />

      {isXs
        ? (
            [
              ['New document', NewDocumentIcon],
                ['Search', SearchIcon],
                ['Settings', SettingsIcon],
                ['Account', AccountIcon],
            ].map(([label, Icon], index) => (
              <Tooltip key={index} content={label} placement="bottom">
                <button type="button" className="btn btn-transparent-blur rounded-full p-2 aspect-square pointer-events-auto">
                  <Icon size="1.25em" ariaLabel={label} />
                </button>
              </Tooltip>
            ))
        )
        : (
          <Tippy
            render={attrs => (
              <div
                className="rounded-lg backdrop-blur shadow-lg w-48 max-w-full pointer-events-auto"
                tabIndex={-1}
                {...attrs}
              >
                {[
                  ['New document', NewDocumentIcon],
                  ['Search', SearchIcon],
                  ['Settings', SettingsIcon],
                  ['Account', AccountIcon],
                ].map(([label, Icon], index) => (
                  <button key={index} type="button" className="block w-full text-left p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 flex gap-3 items-center first:rounded-t-lg last:rounded-b-lg">
                    <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
                      <Icon size="1.25em" noAriaLabel />
                    </span>

                    {label}
                  </button>
                ))}
              </div>
            )}
            placement="bottom-end"
            trigger="click"
            interactive
          >
            <button type="button" className="btn btn-transparent-blur rounded-full p-2 aspect-square pointer-events-auto">
              <MenuIcon size="1.25em" ariaLabel="Menu" />
            </button>
          </Tippy>
        )
      }
    </nav>
  )

  /*
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
  */
})

export default TopBar
