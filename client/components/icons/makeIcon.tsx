import {omit} from 'lodash';
import React, { ReactNode, SVGProps } from 'react';

type AriaProps = { noAriaLabel: true } | { 'aria-label': string };

export type IconProps = SVGProps<SVGSVGElement> &
  AriaProps & {
    size?: number | string;
    className?: string;
  };

export default (children: ReactNode) =>
  ({
    size = '1em',
    className: userClassName = '',
    'aria-label': ariaLabel,
    ...otherProps
  }: IconProps) => {
    const className = `pointer-events-none shrink-0 ${userClassName}`;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={className}
        {...omit(otherProps, 'noAriaLabel')}
      >
        {children}
      </svg>
    );
  };
