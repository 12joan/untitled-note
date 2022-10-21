import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import useNewDocument from '~/lib/useNewDocument'
import { LogoutLink } from '~/lib/routes'

import Tooltip from '~/components/Tooltip'
import Dropdown, { DropdownItem } from '~/components/Dropdown'
import SidebarIcon from '~/components/icons/SidebarIcon'
import MenuIcon from '~/components/icons/MenuIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'
import SettingsIcon from '~/components/icons/SettingsIcon'
import AccountIcon from '~/components/icons/AccountIcon'

const TopBar = forwardRef(({ showSidebarButton, onSidebarButtonClick, ...otherProps }, ref) => {
  const { project, showSearchModal } = useContext()

  const { isXs } = useBreakpoints()

  const createNewDocument = useNewDocument()

  const navButtons = [
    { icon: NewDocumentIcon, label: 'New document', onClick: createNewDocument },
    { icon: SearchIcon, label: 'Search', onClick: showSearchModal },
    { icon: SettingsIcon, label: 'Settings' },
    { icon: AccountIcon, label: 'Log out', as: LogoutLink },
  ]

  return (
    <nav
      ref={ref}
      className="fixed top-0 p-5 pointer-events-none flex items-center gap-2 z-10"
      {...otherProps}
    >
      {showSidebarButton && (
        <Tooltip content="Show sidebar" fixed>
          <NavButton
            icon={SidebarIcon}
            label="Show sidebar"
            onClick={onSidebarButtonClick}
          />
        </Tooltip>
      )}

      <div className={`font-medium ${showSidebarButton ? '' : '-ml-3'} px-3 py-1 rounded-full transparent-blur pointer-events-auto truncate`}>
        {project.name}
      </div>

      <div className="grow" />

      {isXs
        ? navButtons.map(({ label, ...otherProps }) => (
          <Tooltip key={label} content={label} fixed>
            <NavButton label={label} {...otherProps} />
          </Tooltip>
        ))
        : (
          <Dropdown
            items={navButtons.map(({ label, ...otherProps }) => (
              <DropdownItem key={label} children={label} {...otherProps} />
            ))}
            placement="bottom-end"
            className="pointer-events-auto"
          >
            <NavButton icon={MenuIcon} label="Menu" />
          </Dropdown>
        )
      }
    </nav>
  )
})

const NavButton = forwardRef(({ icon: Icon, label, as: Component = 'button', ...otherProps }, ref) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      ref={ref}
      {...buttonProps}
      className="shrink-0 block btn btn-no-rounded transparent-blur rounded-full p-2 aspect-square pointer-events-auto"
      {...otherProps}
    >
      <Icon size="1.25em" ariaLabel={label} />
    </Component>
  )
})

export default TopBar
