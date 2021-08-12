import React from 'react'
import { useHistory } from 'react-router-dom'

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

const buildUrl = ({ projectId, keywordId, documentId }) => {
  let url = ''

  if (projectId === undefined) {
    return '/'
  } else {
    url += `/projects/${projectId}`

    if (keywordId !== undefined) {
      url += `/keywords/${keywordId}`
    }

    url += '/documents'

    if (documentId !== undefined) {
      url += `/${documentId}`
    }

    return url
  }
}

export default RouteContextProvider
