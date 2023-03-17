import { useState } from 'react'

import useElementSize from '~/lib/useElementSize'

const useViewportSize = () => {
  const [size] = useElementSize(document.body)
  return size
}

export default useViewportSize
