import { useState, useRef } from 'react'

import { useGlobalEvent, dispatchGlobalEvent } from '~/lib/globalEvents'

const CONNECTION_STATUS_CONNECTING = 'connecting'
const CONNECTION_STATUS_CONNECTED = 'connected'
const CONNECTION_STATUS_DISCONNECTED = 'disconnected'

let connectionStatus = CONNECTION_STATUS_CONNECTING

const handleSubscriptionStatusChanged = subscriptionConnected => {
  const newStatus = subscriptionConnected ? CONNECTION_STATUS_CONNECTED : CONNECTION_STATUS_DISCONNECTED

  if (newStatus !== connectionStatus) {
    connectionStatus = newStatus
    dispatchGlobalEvent('connectionStatusChanged', newStatus)
  }
}

const useConnectionStatus = () => {
  const [status, setStatus] = useState(connectionStatus)
  const timeoutRef = useRef(null)

  useGlobalEvent('connectionStatusChanged', newStatus => {
    if (newStatus === CONNECTION_STATUS_CONNECTED) {
      clearTimeout(timeoutRef.current)
      setStatus(newStatus)
    } else {
      timeoutRef.current = setTimeout(() => setStatus(newStatus), 1000)
    }
  })

  return status
}

const useConnected = () => useConnectionStatus() === CONNECTION_STATUS_CONNECTED
const useDisconnected = () => useConnectionStatus() === CONNECTION_STATUS_DISCONNECTED

export {
  CONNECTION_STATUS_CONNECTING,
  CONNECTION_STATUS_CONNECTED,
  CONNECTION_STATUS_DISCONNECTED,
  handleSubscriptionStatusChanged,
  useConnectionStatus,
  useConnected,
  useDisconnected,
}
