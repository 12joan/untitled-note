import React, { ReactNode, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  ariaLabel?: string;
  noAriaLabel?: boolean;
  className?: string;
}

export default (children: ReactNode) =>
  ({
    size = '1em',
    ariaLabel,
    noAriaLabel = false,
    className: userClassName = '',
    ...otherProps
  }: IconProps) => {
    if (ariaLabel === undefined && !noAriaLabel) {
      throw new Error(
        'Icon component must have either an ariaLabel or noAriaLabel prop'
      );
    }

    const className = `pointer-events-none ${userClassName}`;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        aria-label={ariaLabel}
        aria-hidden={noAriaLabel}
        className={className}
        {...otherProps}
      >
        {children}
      </svg>
    );
  };
