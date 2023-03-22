import { useState, useLayoutEffect } from 'react'

import Future from '~/lib/future'

const useStream = (getStream, dependencies) => {
  const [future, setFuture] = useState(Future.pending())

  useLayoutEffect(() => {
    setFuture(Future.pending())
    const stream = getStream(data => setFuture(Future.resolved(data)))
    return () => stream.unsubscribe()
  }, dependencies)

  return future
}

export default useStream
