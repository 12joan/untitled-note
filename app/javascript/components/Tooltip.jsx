import React from 'react'

import Tippy from '~/components/Tippy'

const Tooltip = ({ ...otherProps }) => {
  return (
    <Tippy
      headless={false}
      theme="custom"
      arrow={false}
      {...otherProps}
    />
  )
}

export default Tooltip
