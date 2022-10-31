import React, { useRef } from 'react'
import { followCursor } from 'tippy.js'

import useEventListener from '~/lib/useEventListener'
import { useContext, ContextProvider } from '~/lib/context'

import Tippy from '~/components/Tippy'

const Dropdown = ({ items, className: userClassName = '', ...otherProps }) => {
  const tippyRef = useRef()
  const getTippy = () => tippyRef.current._tippy
  const isVisible = () => getTippy().state.isVisible
  const close = () => getTippy().hide()

  const className = `rounded-lg backdrop-blur-lg shadow-lg w-48 max-w-full ${userClassName}`

  useEventListener(window, 'keydown', event => {
    if (event.key === 'Escape' && isVisible()) {
      close()
    }
  })

  return (
    <ContextProvider closeDropdown={close}>
      <Tippy
        ref={tippyRef}
        render={attrs => (
          <div
            className={className}
            tabIndex={-1}
            children={items}
            {...attrs}
          />
        )}
        trigger="click"
        interactive
        {...otherProps}
      />
    </ContextProvider>
  )
}

const DropdownItem = ({
  icon: Icon,
  children,
  as: Component = 'button',
  className = '',
  onClick = () => {},
  ...otherProps
}) => {
  const { closeDropdown } = useContext()
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className={`block w-full text-left p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 flex gap-3 items-center first:rounded-t-lg last:rounded-b-lg ${className}`}
      onClick={event => {
        closeDropdown()
        onClick(event)
      }}
      {...otherProps}
    >
      {Icon && (
        <span className="text-primary-500 dark:text-primary-400 window-inactive:text-slate-500 dark:window-inactive:text-slate-400">
          <Icon size="1.25em" noAriaLabel />
        </span>
      )}

      {children}
    </Component>
  )
}

const ContextMenuDropdown = ({ ...otherProps }) => {
  return (
    <Dropdown
      plugins={[followCursor]}
      followCursor="initial"
      trigger="contextmenu"
      placement="bottom-start"
      offset={0}
      {...otherProps}
    />
  )
}

export default Dropdown

export {
  DropdownItem,
  ContextMenuDropdown,
}
