import React, { ElementType, ReactNode } from 'react';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import { PolyProps } from '~/lib/polymorphic';
import { IconProps } from '~/components/icons/makeIcon';
import { Tippy, TippyProps } from '~/components/Tippy';
import { Tooltip } from '~/components/Tooltip';

export interface FloatingToolbarProps {
  open: boolean;
  tippyProps?: Partial<TippyProps>;
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
}: FloatingToolbarProps) => {
  return (
    <Tippy
      placement="top"
      visible={open}
      appendTo={document.body}
      interactive
      {...tippyProps}
      render={(attrs) =>
        open && (
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
        )
      }
    >
      {children}
    </Tippy>
  );
};

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
              'bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75',
            textColor: 'text-primary-500 dark:text-primary-400',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
          },
          className
        )}
        {...otherProps}
      >
        <Icon size="1.25em" ariaLabel={label} />
      </Component>
    </Tooltip>
  );
};
