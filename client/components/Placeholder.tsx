import React, { ElementType } from 'react';

export interface PlaceholderProps extends Record<string, any> {
  as?: ElementType<any>;
  className?: string;
}

export const Placeholder = ({
  as: Component = 'div',
  className = '',
  ...otherProps
}: PlaceholderProps) => {
  return (
    <Component
      className={`bg-slate-200 dark:bg-slate-800 motion-safe:animate-pulse cursor-wait ${className}`}
      {...otherProps}
    />
  );
};

export interface InlinePlaceholderProps extends PlaceholderProps {
  length?: string | number;
}

export const InlinePlaceholder = ({
  length = '12ch',
  className = '',
  ...otherProps
}: InlinePlaceholderProps) =>
  Placeholder({
    as: 'span',
    className: `inline-block rounded-full h-4 ${className}`,
    style: { width: length },
    ...otherProps,
  });
