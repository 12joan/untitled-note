import React, { forwardRef } from 'react'
import NormalTippy from '@tippyjs/react'
import HeadlessTippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'

import { useContext } from '~/lib/context'

const Tippy = forwardRef(({ headless = true, ...otherProps }, ref) => {
  const { inModal = false } = useContext()

  const TippyComponent = headless ? HeadlessTippy : NormalTippy

  return (
    <TippyComponent
      ref={ref}
      zIndex={inModal ? 40 : 20}
      {...otherProps}
    />
  )
})

export default Tippy
