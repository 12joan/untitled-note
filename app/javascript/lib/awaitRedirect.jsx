import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { awaitRedirectPath } from '~/lib/routes'

let promisePath = null, fallbackPath = null

const awaitRedirect = (navigate, _promisePath, _fallbackPath) => {
  promisePath = _promisePath
  fallbackPath = _fallbackPath
  navigate(awaitRedirectPath)
}

const AwaitRedirectComponent = () => {
  const [redirectPath, setRedirectPath] = useState(null)

  useEffect(() => (promisePath ?? Promise.reject()).then(
    path => setRedirectPath(path),
    error => setRedirectPath(fallbackPath || '/')
  ), [])

  return redirectPath
    ? <Navigate to={redirectPath} replace />
    : 'Loading...'
}

export default awaitRedirect

export { AwaitRedirectComponent }
