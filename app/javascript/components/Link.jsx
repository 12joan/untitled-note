import React, { forwardRef } from 'react'
import * as ReactRouter from 'react-router-dom'

const Link = forwardRef(({ nav = false, className: userClassName = '', ...otherProps }, ref) => {
  const className = `select-none ${userClassName}`

  if (nav) {
    return (
      <ReactRouter.NavLink
        ref={ref}
        className={({ isActive }) => isActive
          ? `${className} nav-active`
          : className
        }
        {...otherProps}
      />
    )
  } else {
    return (
      <ReactRouter.Link
        ref={ref}
        className={className}
        {...otherProps}
      />
    )
  }
})

export default Link
