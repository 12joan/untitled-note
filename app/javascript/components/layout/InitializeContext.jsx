import React from 'react'
import { useRef } from 'react'

import useVirtualEvent from '~/lib/useVirtualEvent'
import { ContextProvider } from '~/lib/context'

const InitializeContext = props => {
  const sendSidebarEvent = useVirtualEvent()

  return (
    <ContextProvider
      sendSidebarEvent={sendSidebarEvent}>
      {props.children}
    </ContextProvider>
  )
}

export default InitializeContext
