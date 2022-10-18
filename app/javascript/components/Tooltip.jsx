import React from 'react'

import Tippy from '~/components/Tippy'

const Tooltip = ({ fixed = false, popperOptions = {}, ...otherProps }) => {
  return (
    <Tippy
      headless={false}
      theme="custom"
      arrow={false}
      popperOptions={{
        ...(fixed ? { strategy: 'fixed' } : {}),
        ...popperOptions,
      }}
      touch={false}
      {...otherProps}
    />
  )
}

export default Tooltip
