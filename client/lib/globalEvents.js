import { useEffect } from 'react'

const eventListeners = new Map()

const useGlobalEvent = (eventName, handler, deps) => {
  useEffect(() => {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, new Set())
    }

    const listeners = eventListeners.get(eventName)

    listeners.add(handler)

    return () => listeners.delete(handler)
  }, deps)
}

const dispatchGlobalEvent = (eventName, ...args) => {
  const listeners = eventListeners.get(eventName)

  if (listeners) {
    // The [...listeners] prevents infinite loops in case the set is modified by the listener
    [...listeners].forEach(listener => listener(...args))
  }
}

export { useGlobalEvent, dispatchGlobalEvent }
