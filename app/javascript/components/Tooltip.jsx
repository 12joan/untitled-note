import React from 'react'

import Tippy from '~/components/Tippy'

const Tooltip = ({ ...otherProps }) => {
  return (
    <Tippy
      theme="custom"
      arrow={false}
      {...otherProps}
    />
  )
}

export default Tooltip
