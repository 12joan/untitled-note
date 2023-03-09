import { useState } from 'react'
import useEventListener from '~/lib/useEventListener'

const useViewportSize = () => {
  const getViewport = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  const [viewport, setViewport] = useState(getViewport())

  useEventListener(window, 'resize', () => setViewport(getViewport()))

  return viewport
}

export default useViewportSize
