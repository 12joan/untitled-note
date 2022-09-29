import { useState, useLayoutEffect } from 'react'

const useElementSize = ref => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  const setSizeForElement = element => setSize({
    width: element.offsetWidth,
    height: element.offsetHeight,
  })

  useLayoutEffect(() => {
    const element = ref.current

    const observer = new ResizeObserver(entries => setSizeForElement(entries[0].target))
    observer.observe(element)

    setSizeForElement(element)

    return () => observer.disconnect()
  }, [ref])

  return size
}

export default useElementSize
