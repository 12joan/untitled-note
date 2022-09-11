import React from 'react'

const makeIcon = children => ({ size = '1em', ...otherProps }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="currentColor"
    {...otherProps}
  >
    {children}
  </svg>
)

export default makeIcon
