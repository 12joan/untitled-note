import React from 'react'
import { useRef } from 'react'

import useVirtualEvent from 'lib/useVirtualEvent'
import { ContextProvider } from 'lib/context'

const InitializeContext = props => {
  const toggleSidebarEvent = useVirtualEvent()

  return (
    <ContextProvider
      toggleSidebarEvent={toggleSidebarEvent}>
      {props.children}
    </ContextProvider>
  )
}

export default InitializeContext
