import React, { useRef, ReactNode, ElementType, MouseEvent } from 'react'
import { followCursor } from 'tippy.js'

import { useEventListener } from '~/lib/useEventListener'
import { useContext, ContextProvider } from '~/lib/context'
import { IconProps } from '~/components/icons/makeIcon'

import { Tippy, TippyProps, TippyInstance } from '~/components/Tippy'

export interface DropdownProps extends TippyProps {
  items: ReactNode;
  className?: string;
}

export const Dropdown = ({
  items,
  className: userClassName = '',
  ...otherProps
}: DropdownProps) => {
  const tippyRef = useRef<TippyInstance>(null)
  const close = () => tippyRef.current?.hide()

  const className = `rounded-lg backdrop-blur-lg shadow-lg w-auto max-w-full ${userClassName}`

  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tippyRef.current?.state?.isVisible) {
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

export interface DropdownItemProps extends Record<string, any> {
  as?: ElementType;
  icon?: ElementType<IconProps>;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  children: ReactNode;
}

export const DropdownItem = ({
  as: Component = 'button',
  icon: Icon,
  className = '',
  onClick = () => {},
  children,
  ...otherProps
}: DropdownItemProps) => {
  const { closeDropdown } = useContext() as {
    closeDropdown: () => void;
  }

  const buttonProps = Component === 'button'
    ? { type: 'button' }
    : {}

  return (
    <Component
      {...buttonProps}
      className={`block w-full text-left p-3 pr-5 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 flex gap-3 items-center first:rounded-t-lg last:rounded-b-lg ${className}`}
      onClick={(event: MouseEvent) => {
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

export const ContextMenuDropdown = (dropdownProps: DropdownProps) => {
  return (
    <Dropdown
      plugins={[followCursor]}
      followCursor="initial"
      trigger="contextmenu"
      placement="bottom-start"
      offset={[0, 0]}
      {...dropdownProps}
    />
  )
}
