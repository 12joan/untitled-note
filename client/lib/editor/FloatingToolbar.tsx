import type React from 'react';
import type { ElementType, ReactNode } from 'react';
import type { IconProps } from '~/components/icons/makeIcon';
import { Tippy, type TippyInstance, type TippyProps } from '~/components/Tippy';
import { Tooltip } from '~/components/Tooltip';
import {
  type GroupedClassNames,
  groupedClassNames,
} from '~/lib/groupedClassNames';
import type { PolyProps } from '~/lib/polymorphic';

export interface FloatingToolbarProps {
  open?: boolean;
  tippyProps?: Partial<
    TippyProps & {
      ref: React.RefObject<TippyInstance>;
    }
  >;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  items: ReactNode;
  children?: TippyProps['children'];
}

export const FloatingToolbar = ({
  open,
  tippyProps = {},
  containerProps: { className: containerClassName, ...containerProps } = {},
  items,
  children,
}: FloatingToolbarProps) => (
  <Tippy
    placement="top"
    visible={open}
    appendTo={document.body}
    interactive
    {...tippyProps}
    render={(attrs) => (
      <div
        className={groupedClassNames(
          'rounded-lg backdrop-blur shadow text-base slate-popover',
          containerClassName
        )}
        contentEditable={false}
        {...attrs}
        {...containerProps}
      >
        {items}
      </div>
    )}
  >
    {children}
  </Tippy>
);

export type FloatingToolbarItemProps<C extends ElementType> = PolyProps<
  C,
  {
    icon: ElementType<IconProps>;
    label: string;
    className?: GroupedClassNames;
  }
>;

export const FloatingToolbarItem = <C extends ElementType = 'button'>({
  as,
  icon: Icon,
  label,
  className,
  ...otherProps
}: FloatingToolbarItemProps<C>) => {
  const Component = as || 'button';
  const buttonProps = Component === 'button' ? { type: 'button' } : {};

  return (
    <Tooltip content={label}>
      <Component
        {...(buttonProps as any)}
        className={groupedClassNames(
          {
            padding: 'p-3',
            rounded: 'first:rounded-l-lg last:rounded-r-lg',
            backgroundColor:
              'bg-plain-100/75 dark:bg-plain-700/75 hocus:bg-plain-200/75 dark:hocus:bg-plain-800/75',
            textColor: 'text-primary-500 dark:text-primary-400',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
          },
          className
        )}
        aria-label={label}
        {...otherProps}
      >
        <Icon size="1.25em" noAriaLabel />
      </Component>
    </Tooltip>
  );
};
