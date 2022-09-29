import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import useStateWhileMounted from '~/lib/useStateWhileMounted'
import { awaitRedirectPath } from '~/lib/routes'

import LoadingView from '~/components/LoadingView'

let promisePath = null, fallbackPath = null

const awaitRedirect = ({
  navigate,
  promisePath: _promisePath,
  fallbackPath: _fallbackPath,
  projectId,
}) => {
  promisePath = _promisePath
  fallbackPath = _fallbackPath
  navigate(awaitRedirectPath(projectId))
}

const AwaitRedirectComponent = () => {
  const [redirectPath, setRedirectPath] = useStateWhileMounted(null)

  useEffect(() => {
    (promisePath ?? Promise.reject()).then(
      path => setRedirectPath(path),
      error => setRedirectPath(fallbackPath || '/')
    )
  }, [])

  return redirectPath
    ? <Navigate to={redirectPath} replace />
    : <LoadingView />
}

export default awaitRedirect

export { AwaitRedirectComponent }
