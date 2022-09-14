import React, { forwardRef } from 'react'
import Tippy from '@tippyjs/react/headless'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'
import { NewDocumentLink } from '~/lib/routes'

import Tooltip from '~/components/Tooltip'
import { InlinePlaceholder } from '~/components/Placeholder'
import SidebarIcon from '~/components/icons/SidebarIcon'
import MenuIcon from '~/components/icons/MenuIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import SearchIcon from '~/components/icons/SearchIcon'
import SettingsIcon from '~/components/icons/SettingsIcon'
import AccountIcon from '~/components/icons/AccountIcon'

const TopBar = forwardRef(({ showSidebarButton, onSidebarButtonClick, ...otherProps }, ref) => {
  const { futureProject } = useContext()

  const { isXs } = useBreakpoints()

  const navButtons = [
    { icon: NewDocumentIcon, label: 'New document', as: NewDocumentLink },
    { icon: SearchIcon, label: 'Search' },
    { icon: SettingsIcon, label: 'Settings' },
    { icon: AccountIcon, label: 'Account' },
  ]

  return (
    <nav
      ref={ref}
      className="fixed top-0 right-0 p-5 pointer-events-none flex items-center gap-2 z-10"
      {...otherProps}
    >
      {showSidebarButton && (
        <Tooltip content="Show sidebar">
          <div>
            <NavButton
              icon={SidebarIcon}
              label="Show sidebar"
              onClick={onSidebarButtonClick}
            />
          </div>
        </Tooltip>
      )}

      <div className={`font-medium ${showSidebarButton ? '' : '-ml-3'} px-3 py-1 rounded-full transparent-blur pointer-events-auto truncate`}>
        {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
      </div>

      <div className="grow" />

      {isXs
        ? navButtons.map(({ label, ...otherProps }) => (
          <Tooltip key={label} content={label}>
            <div>
              <NavButton label={label} {...otherProps} />
            </div>
          </Tooltip>
        ))
        : (
          <Tippy
            render={attrs => (
              <div
                className="rounded-lg backdrop-blur shadow-lg w-48 max-w-full pointer-events-auto"
                tabIndex={-1}
                {...attrs}
              >
                <div>
                  {navButtons.map((config, i) => (
                    <DropdownButton key={i} {...config} key={config.label} />
                  ))}
                </div>
              </div>
            )}
            placement="bottom-end"
            trigger="click"
            interactive
          >
            <div>
              <NavButton icon={MenuIcon} label="Menu" />
            </div>
          </Tippy>
        )
      }
    </nav>
  )
})

const NavButton = ({ icon: Icon, label, as: Component = 'button', ...otherProps }) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className="block btn btn-transparent-blur rounded-full p-2 aspect-square pointer-events-auto"
      {...otherProps}
    >
      <Icon size="1.25em" ariaLabel={label} />
    </Component>
  )
}

const DropdownButton = ({ icon: Icon, label, as: Component = 'button', ...otherProps }) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className="block w-full text-left p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 flex gap-3 items-center first:rounded-t-lg last:rounded-b-lg"
      {...otherProps}
    >
      <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
        <Icon size="1.25em" noAriaLabel />
      </span>

      {label}
    </Component>
  )
}

export default TopBar
