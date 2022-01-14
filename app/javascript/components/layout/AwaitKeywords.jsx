import React from 'react'

import { useContext, ContextProvider } from 'lib/context'
import KeywordsStream from 'lib/streams/KeywordsStream'

import LoadAsync from 'components/LoadAsync'
import LoadingPlaceholder from 'components/LoadingPlaceholder'

const AwaitKeywords = props => {
  const { projectId } = useContext()

  return (
    <LoadAsync
      dependenciesRequiringClear={[projectId]}

      provider={(resolve, reject) => {
        const subscription = KeywordsStream(projectId).index({}, resolve)
        return () => subscription.unsubscribe()
      }}

      loading={() => <LoadingPlaceholder className="h-100" />}

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
