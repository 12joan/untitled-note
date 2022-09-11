import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

const Tooltip = ({ content, placement, children }) => {
  return (
    <Tippy
      content={content}
      placement={placement}
      theme="custom"
      arrow={false}
      children={children}
    />
  )
}

export default Tooltip
