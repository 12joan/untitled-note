import { useEffect } from 'react'

const useTimerFactory = (setTimer, clearTimer) => (f, delay, dependencies = []) => {
  useEffect(() => {
    const timer = setTimer(f, delay)
    return () => clearTimer(timer)
  }, dependencies)
}

const useTimeout = useTimerFactory(setTimeout, clearTimeout)
const useInterval = useTimerFactory(setInterval, clearInterval)

export { useTimeout, useInterval } 
