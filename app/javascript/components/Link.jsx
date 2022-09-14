import React from 'react'
import * as ReactRouter from 'react-router-dom'

const Link = ({ nav = false, className: userClassName = '', ...otherProps }) => {
  const className = `select-none ${userClassName}`

  if (nav) {
    return (
      <ReactRouter.NavLink
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
        className={className}
        {...otherProps}
      />
    )
  }
}

export default Link
