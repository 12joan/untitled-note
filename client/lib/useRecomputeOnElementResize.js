import { useState, useReducer, useEffect } from 'react'

const useRecomputeOnElementResize = fn => (initialElement = null) => {
  const [element, setElement] = useState(initialElement)

  const value = fn(element)

  const [, forceRender] = useReducer(x => x + 1, 0)

  // Re-render when the element resizes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => forceRender())
    if (element) resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [element])

  return initialElement
    ? [value, forceRender]
    : [setElement, value, forceRender]
}

export default useRecomputeOnElementResize
