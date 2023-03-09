import React from 'react'

const makeIcon = children => ({ size = '1em', ariaLabel, noAriaLabel = false, className: userClassName = '', ...otherProps }) => {
  if (ariaLabel === undefined && !noAriaLabel) {
    console.error('Icon component must have either an ariaLabel or noAriaLabel prop')
  }

  const className = `pointer-events-none ${userClassName}`

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
  )
}

export default makeIcon
