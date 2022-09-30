import React from 'react'

import { routesComponent } from '~/lib/routes'

import ErrorBoundary from '~/components/ErrorBoundary'
import ToastContainer from '~/components/layout/ToastContainer'

const App = () => {
  const fallback = (
    <div className="p-5 space-y-3">
      <h1 className="text-3xl font-medium">An internal error has occurred</h1>
      {/* TODO: Add contact details */}
      <p className="text-lg font-light">This probably isn't your fault. Let us know if the problem persists.</p>
      <p><a href="/" className="btn btn-link font-medium">Go back to the home page</a></p>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      {routesComponent}
      <ToastContainer />
    </ErrorBoundary>
  )
}

export default App
