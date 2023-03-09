import React from 'react'
import { Navigate } from 'react-router-dom'

import useStateWhileMounted from '~/lib/useStateWhileMounted'
import { useAwaitRedirect } from '~/lib/awaitRedirect'

import LoadingView from '~/components/LoadingView'

const AwaitRedirect = () => {
  const [redirectPath, setRedirectPath] = useStateWhileMounted(null)

  useAwaitRedirect(setRedirectPath)

  return redirectPath
    ? <Navigate to={redirectPath} replace />
    : <LoadingView />
}

export default AwaitRedirect
