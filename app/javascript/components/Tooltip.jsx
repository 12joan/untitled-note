import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

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
