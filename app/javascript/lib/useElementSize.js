import { useState, useLayoutEffect } from 'react'

const useElementSize = ref => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current

    const observer = new ResizeObserver(() => {
      setSize({ width: element.offsetWidth, height: element.offsetHeight })
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return size
}

export default useElementSize
