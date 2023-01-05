import { useState, useRef } from 'react'

import { useGlobalEvent, dispatchGlobalEvent } from '~/lib/globalEvents'

let connected = false

const handleSubscriptionStatusChanged = subscriptionConnected => {
  if (connected !== subscriptionConnected) {
    connected = subscriptionConnected
    dispatchGlobalEvent('connectionStatusChanged', connected)
  }
}

const useConnected = () => {
  const [connectionStatus, setConnectionStatus] = useState(connected)
  const timeoutRef = useRef(null)

  useGlobalEvent('connectionStatusChanged', connected => {
    if (connected) {
      clearTimeout(timeoutRef.current)
      setConnectionStatus(true)
    } else {
      timeoutRef.current = setTimeout(() => setConnectionStatus(false), 1000)
    }
  })

  return connectionStatus
}

export { useConnected, handleSubscriptionStatusChanged }
