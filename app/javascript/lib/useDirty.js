import { useState, useEffect } from 'react'

import useCounter from '~/lib/useCounter'
import { useInterval } from '~/lib/useTimer'

const useDirty = (fetch, interval) => {
  const [clock, incrementClock] = useCounter()
  const [localVersion, incrementLocalVersion] = useCounter()
  const [remoteVersion, setRemoteVersion] = useState(localVersion)
  const [isFetching, setIsFetching] = useState(false)
  const [lastFetchFailed, setLastFetchFailed] = useState(false)

  const isDirty = localVersion > remoteVersion

  useInterval(incrementClock, interval)

  useEffect(() => {
    if (isDirty && !isFetching) {
      setIsFetching(true)

      const fetchingVersion = localVersion

      fetch(fetchingVersion)
        .then(() => {
          setRemoteVersion(fetchingVersion)
          setLastFetchFailed(false)
        })
        .catch(error => {
          console.error(error)
          setLastFetchFailed(true)
        })
        .then(() => {
          setIsFetching(false)
        })
    }
  }, [clock])

  return {
    isDirty,
    localVersion,
    remoteVersion,
    makeDirty: incrementLocalVersion,
    enqueueFetch: incrementClock,
    lastFetchFailed,
  }
}

export default useDirty
