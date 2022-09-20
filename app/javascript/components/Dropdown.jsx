import React, { useRef } from 'react'

import useEventListener from '~/lib/useEventListener'

import Tippy from '~/components/Tippy'

const Dropdown = ({ items, className: userClassName = '', ...otherProps }) => {
  const tippyRef = useRef()

  const className = `rounded-lg backdrop-blur shadow-lg w-48 max-w-full ${userClassName}`

  useEventListener(window, 'keydown', event => {
    const tippy = tippyRef.current._tippy

    if (event.key === 'Escape' && tippy.state.isVisible) {
      tippy.hide()
    }
  })

  return (
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
  )
}

const DropdownItem = ({ icon: Icon, children, as: Component = 'button', className = '', ...otherProps }) => {
  const buttonProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      {...buttonProps}
      className={`block w-full text-left p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 flex gap-3 items-center first:rounded-t-lg last:rounded-b-lg ${className}`}
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

export default Dropdown

export {
  DropdownItem
}
