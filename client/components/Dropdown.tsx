import React, {
  CSSProperties,
  ElementType,
  MouseEvent,
  ReactNode,
  useMemo,
  useRef,
} from 'react';
import { Modifier } from '@popperjs/core';
import maxSize from 'popper-max-size-modifier';
import { followCursor } from 'tippy.js';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import { PolyProps } from '~/lib/polymorphic';
import { mergeRefs, Ref } from '~/lib/refUtils';
import { useEventListener } from '~/lib/useEventListener';
import { useFocusOut } from '~/lib/useFocusOut';
import { IconProps } from '~/components/icons/makeIcon';
import { Tippy, TippyInstance, TippyProps } from '~/components/Tippy';

const applyMaxSize: Modifier<any, any> = {
  name: 'applyMaxSize',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['maxSize'],
  fn({ state }) {
    // The `maxSize` modifier provides this data
    const { width, height } = state.modifiersData.maxSize;

    state.styles.popper = {
      ...state.styles.popper,
      maxWidth: `calc(${width}px - 1rem)`,
      maxHeight: `calc(${height}px - 1rem)`,
    };
  },
};

export const dropdownClassNames: GroupedClassNames = {
  width: 'w-auto max-w-full',
  backgroundColor: 'bg-plain-100/75 dark:bg-plain-700/75',
  backdropBlur: 'backdrop-blur-lg',
  shadow: 'shadow-dialog',
  rounded: 'rounded-lg',
  overflow: 'overflow-y-auto max-h-[inherit]',
  ringInset: '[&_*]:ring-inset',
};

export const dropdownItemClassNames: GroupedClassNames = {
  display: 'flex',
  width: 'w-full',
  textAlign: 'text-left',
  padding: 'p-3',
  hocusBackgroundColor: 'hocus:bg-plain-200/75 dark:hocus:bg-plain-800/75',
  gap: 'gap-3',
  alignItems: 'items-center',
  rounded: 'first:rounded-t-lg last:rounded-b-lg',
};

export interface DropdownProps extends Omit<TippyProps, 'className'> {
  items: ReactNode;
  className?: GroupedClassNames;
  style?: CSSProperties;
  tippyRef?: Ref<TippyInstance | null>;
  closeOnFocusOut?: boolean;
  autoMaxSize?: boolean;
}

export const Dropdown = ({
  items,
  popperOptions: propPopperOptions = {},
  className,
  style,
  tippyRef: tippyRefProp,
  closeOnFocusOut = true,
  autoMaxSize = true,
  ...otherProps
}: DropdownProps) => {
  const tippyRef = useRef<TippyInstance>(null);
  const close = () => tippyRef.current?.hide();

  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && tippyRef.current?.state?.isVisible) {
      close();
    }
  });

  const [focusOutRef, focusOutProps] = useFocusOut<HTMLDivElement>(
    closeOnFocusOut ? close : () => {}
  );

  const popperOptions = useMemo(
    () => ({
      ...propPopperOptions,
      modifiers: [
        ...(propPopperOptions.modifiers || []),
        ...(autoMaxSize ? [maxSize, applyMaxSize] : []),
      ],
    }),
    [propPopperOptions]
  );

  return (
    <AppContextProvider closeDropdown={close}>
      <div ref={focusOutRef} {...focusOutProps} className="contents">
        <Tippy
          ref={mergeRefs([tippyRef, tippyRefProp])}
          render={(attrs) => (
            <div
              className={groupedClassNames(dropdownClassNames, className)}
              style={style}
              tabIndex={-1}
              children={items}
              {...attrs}
              data-delete-me-dropdown
            />
          )}
          trigger="click"
          interactive
          popperOptions={popperOptions}
          {...otherProps}
        />
      </div>
    </AppContextProvider>
  );
};

export type DropdownItemProps<C extends ElementType> = PolyProps<
  C,
  {
    icon?: ElementType<IconProps>;
    variant?: 'default' | 'danger';
    className?: GroupedClassNames;
    onClick?: (event: MouseEvent) => void;
    children: ReactNode;
  }
>;

export const DropdownItem = <C extends ElementType = 'button'>({
  as,
  icon: Icon,
  variant = 'default',
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
        <span
          className={groupedClassNames({
            variant: {
              default: 'text-primary-500 dark:text-primary-400',
              danger: 'text-red-500 dark:text-red-400',
            }[variant],
            inactive:
              'window-inactive:text-plain-500 dark:window-inactive:text-plain-400',
          })}
        >
          <Icon size="1.25em" noAriaLabel />
        </span>
      )}

      <span
        className={groupedClassNames({
          base: 'mr-2',
          variant: {
            default: '',
            danger: 'text-red-500 dark:text-red-400',
          }[variant],
        })}
      >
        {children}
      </span>
    </Component>
  );
};

export const ContextMenuDropdown = ({
  popperOptions,
  ...dropdownProps
}: DropdownProps) => {
  return (
    <Dropdown
      plugins={[followCursor]}
      followCursor="initial"
      trigger="contextmenu"
      placement="bottom-start"
      offset={[0, 0]}
      popperOptions={{
        ...popperOptions,
        strategy: 'fixed',
      }}
      {...dropdownProps}
    />
  );
};
