import { useState, useReducer, useMemo, useEffect } from 'react'

const useElementSize = (initialElement = null) => {
  const [element, setElement] = useState(initialElement)

  const width = element?.offsetWidth ?? 0
  const height = element?.offsetHeight ?? 0

  const size = useMemo(() => ({ width, height }), [width, height])

  const [, forceRender] = useReducer(x => x + 1, 0)

  // Re-render when the element resizes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => forceRender())
    if (element) resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [element])

  return initialElement
    ? [size, forceRender]
    : [setElement, size, forceRender]
}

export default useElementSize
