import React, { ReactNode, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  // Required as a reminder to add an aria-label to the parent element
  noAriaLabel: true;
}

export default (children: ReactNode) =>
  ({
    size = '1em',
    className: userClassName = '',
    ...otherProps
  }: IconProps) => {
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
        aria-hidden
        className={className}
        {...otherProps}
      >
        {children}
      </svg>
    );
  };
