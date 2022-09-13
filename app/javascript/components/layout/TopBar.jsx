import React, { forwardRef } from 'react'
import Tippy from '@tippyjs/react/headless'

import { useContext } from '~/lib/context'
import useBreakpoints from '~/lib/useBreakpoints'

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
        {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
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
})

export default TopBar
