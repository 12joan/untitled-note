import React, { useEffect } from 'react'

import { awaitRedirectPath } from '~/lib/routes'

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

const useAwaitRedirect = callback => {
  useEffect(() => {
    (promisePath ?? Promise.reject()).then(
      path => callback(path),
      error => callback(fallbackPath || '/')
    )
  }, [])
}

export default awaitRedirect

export { useAwaitRedirect }
