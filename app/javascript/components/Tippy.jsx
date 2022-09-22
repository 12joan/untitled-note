import React, { forwardRef} from 'react'
import UpstreamTippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'

import { useContext } from '~/lib/context'

const Tippy = forwardRef(({ ...otherProps }, ref) => {
  const { inModal = false } = useContext()

  return (
    <UpstreamTippy
      ref={ref}
      zIndex={inModal ? 40 : 20}
      {...otherProps}
    />
  )
})

export default Tippy
