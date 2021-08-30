import React from 'react'
import { useHistory } from 'react-router-dom'

import { buildUrl } from 'lib/routes'
import { ContextProvider } from 'lib/context'

const RouteContextProvider = props => {
  const history = useHistory()

  const setParams = newParams => {
    const params = { ...props.params, ...newParams }
    history.push(buildUrl(params))
  }

  const context = {
    ...props.params,
    setParams,
  }

  return (
    <ContextProvider context={context}>
      {props.children}
    </ContextProvider>
  )
}

export default RouteContextProvider
