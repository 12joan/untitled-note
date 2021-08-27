import React from 'react'
import { useRef } from 'react'

const useVirtualEvent = () => {
  const eventListeners = useRef([])

  const invoke = (...args) => {
    eventListeners.current.forEach(eventListener => eventListener(...args))
  }

  const addEventListener = eventListener => {
    eventListeners.current = [
      ...eventListeners.current,
      eventListener,
    ]
  }

  const removeEventListener = eventListener => {
    eventListeners.current = eventListeners.current.filter(x => x !== eventListener)
  }

  return { invoke, addEventListener, removeEventListener }
}

export default useVirtualEvent
