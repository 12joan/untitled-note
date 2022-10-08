import React, { useState } from 'react'

import { useContext } from '~/lib/context'
import { useTimeout } from '~/lib/useTimer'

const LoadingView = () => {
  const { topBarHeight = 0 } = useContext()
  const [showLoading, setShowLoading] = useState(false)

  useTimeout(() => setShowLoading(true), 500)

  return (
    <div
      className="m-auto transition-opacity"
      style={{
        paddingBottom: topBarHeight,
        opacity: showLoading ? 1 : 0,
      }}
    >
      {showLoading && (
        <div className="flex gap-2" aria-live="polite" aria-label="Loading">
          {[0, 333, 667].map(delay => (
            <div
              key={delay}
              className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded-full animate-grow"
              style={{
                animationDelay: `${delay}ms`,
                animationDuration: '1000ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LoadingView
