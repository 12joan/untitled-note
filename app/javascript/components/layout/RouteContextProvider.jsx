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
    view: computeView(props.params),
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

const computeView = params => {
  if (params.projectId === undefined) {
    return { type: 'unknown' }
  }

  if (params.documentId === undefined) {
    return { type: 'index', deleted: false }
  }

  if (params.documentId === 'deleted') {
    return { type: 'index', deleted: true }
  }

  return { type: 'show' }
}

export default RouteContextProvider
