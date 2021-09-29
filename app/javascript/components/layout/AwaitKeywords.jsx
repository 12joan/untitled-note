import React from 'react'

import { useContext, ContextProvider } from 'lib/context'
import KeywordsStream from 'lib/streams/KeywordsStream'

import LoadAsync from 'components/LoadAsync'
import AppPlaceholder from 'components/layout/AppPlaceholder'

const AwaitKeywords = props => {
  const { projectId } = useContext()

  return (
    <LoadAsync
      dependencies={[projectId]}

      provider={(resolve, reject) => {
        const subscription = KeywordsStream(projectId).index({}, resolve)
        return () => subscription.unsubscribe()
      }}

      loading={() => <AppPlaceholder />}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load keywords:</strong> An unexpected error occurred
          </div>
        )
      }}

      success={keywords => (
        <ContextProvider keywords={keywords}>
          {props.children}
        </ContextProvider>
      )} />
  )
}

export default AwaitKeywords
