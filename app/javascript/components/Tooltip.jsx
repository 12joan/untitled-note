import React, { forwardRef } from 'react'

import Tippy from '~/components/Tippy'

const Tooltip = forwardRef(({
  onCreate = () => {},
  onDestory = () => {},
  fixed = false,
  popperOptions = {},
  ...otherProps
}, ref) => {
  const setRef = value => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ref.current = value
      }
    }
  }

  return (
    <Tippy
      headless={false}
      theme="custom"
      arrow={false}
      onCreate={tippy => {
        setRef(tippy)
        onCreate(tippy)
      }}
      onDestroy={tippy => {
        setRef(null)
        onDestory(tippy)
      }}
      popperOptions={{
        ...(fixed ? { strategy: 'fixed' } : {}),
        ...popperOptions,
      }}
      touch={false}
      {...otherProps}
    />
  )
})

export default Tooltip
