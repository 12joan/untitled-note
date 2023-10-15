import React, { ElementType, MouseEvent, ReactNode, useRef } from 'react';
import { followCursor } from 'tippy.js';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import { PolyProps } from '~/lib/polymorphic';
import { useEventListener } from '~/lib/useEventListener';
import { useFocusOut } from '~/lib/useFocusOut';
import { IconProps } from '~/components/icons/makeIcon';
import { Tippy, TippyInstance, TippyProps } from '~/components/Tippy';

export const dropdownClassNames: GroupedClassNames = {
  width: 'w-auto max-w-full',
  backdropBlur: 'backdrop-blur-lg',
  shadow: 'shadow-dialog',
  rounded: 'rounded-lg',
};

export interface DropdownProps extends Omit<TippyProps, 'className'> {
  items: ReactNode;
  className?: GroupedClassNames;
}

export const Dropdown = ({
  items,
  className,
  ...otherProps
}: DropdownProps) => {
  const tippyRef = useRef<TippyInstance>(null);
  const close = () => tippyRef.current?.hide();

  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tippyRef.current?.state?.isVisible) {
      close();
    }
  });

  const [focusOutRef, focusOutProps] = useFocusOut<HTMLDivElement>(close);

  return (
    <AppContextProvider closeDropdown={close}>
      <div ref={focusOutRef} {...focusOutProps} className="contents">
        <Tippy
          ref={tippyRef}
          render={(attrs) => (
            <div
              className={groupedClassNames(dropdownClassNames, className)}
              tabIndex={-1}
              children={items}
              {...attrs}
            />
          )}
          trigger="click"
          interactive
          {...otherProps}
        />
      </div>
    </AppContextProvider>
  );
};

export const dropdownItemClassNames: GroupedClassNames = {
  display: 'flex',
  width: 'w-full',
  textAlign: 'text-left',
  padding: 'p-3',
  backgroundColor: 'bg-plain-100/75 dark:bg-plain-700/75',
  hocusBackgroundColor: 'hocus:bg-plain-200/75 dark:hocus:bg-plain-800/75',
  gap: 'gap-3',
  alignItems: 'items-center',
  rounded: 'first:rounded-t-lg last:rounded-b-lg',
};

export type DropdownItemProps<C extends ElementType> = PolyProps<
  C,
  {
    icon?: ElementType<IconProps>;
    className?: GroupedClassNames;
    onClick?: (event: MouseEvent) => void;
    children: ReactNode;
  }
>;

export const DropdownItem = <C extends ElementType = 'button'>({
  as,
  icon: Icon,
  className,
  onClick = () => {},
  children,
  ...otherProps
}: DropdownItemProps<C>) => {
  const Component = as || 'button';
  const buttonProps = Component === 'button' ? { type: 'button' } : {};

  const closeDropdown = useAppContext('closeDropdown');

  return (
    <Component
      {...(buttonProps as any)}
      className={groupedClassNames(dropdownItemClassNames, className)}
      onClick={(event: MouseEvent) => {
        closeDropdown();
        onClick(event);
      }}
      {...otherProps}
    >
      {Icon && (
        <span className="text-primary-500 dark:text-primary-400 window-inactive:text-plain-500 dark:window-inactive:text-plain-400">
          <Icon size="1.25em" noAriaLabel />
        </span>
      )}

      <span className="mr-2">{children}</span>
    </Component>
  );
};

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
  );
};
