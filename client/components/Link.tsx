import React, { ForwardedRef, forwardRef } from 'react';
import * as ReactRouter from 'react-router-dom';

export interface LinkProps extends ReactRouter.LinkProps {
  nav?: boolean;
  className?: string;
}

export const Link = forwardRef(
  (
    { nav = false, className: userClassName = '', ...otherProps }: LinkProps,
    ref: ForwardedRef<HTMLAnchorElement>
  ) => {
    const className = `select-none ${userClassName}`;

    if (nav) {
      return (
        <ReactRouter.NavLink
          ref={ref}
          className={({ isActive }) =>
            isActive ? `${className} nav-active` : className
          }
          {...otherProps}
        />
      );
    }
    return <ReactRouter.Link ref={ref} className={className} {...otherProps} />;
  }
);
