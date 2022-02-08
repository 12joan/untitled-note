import React from 'react'

import { useContext, ContextProvider } from 'lib/context'
import KeywordsStream from 'lib/streams/KeywordsStream'
import MentionablesStream from 'lib/streams/MentionablesStream'

import LoadAsync, { allProviders } from 'components/LoadAsync'
import LoadingPlaceholder from 'components/LoadingPlaceholder'

const AwaitDataForProject = props => {
  const { projectId } = useContext()

  const keywordsAndMentionablesProvider = allProviders([
    (resolve, reject) => {
      const subscription = KeywordsStream(projectId).index({}, resolve)
      return () => subscription.unsubscribe()
    },
    (resolve, reject) => {
      const subscription = MentionablesStream(projectId).index({}, resolve)
      return () => subscription.unsubscribe()
    },
  ])

  return (
    <LoadAsync
      dependenciesRequiringClear={[projectId]}
      provider={keywordsAndMentionablesProvider}

      loading={() => <LoadingPlaceholder className="h-100" />}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load data for project:</strong> An unexpected error occurred
          </div>
        )
      }}

      success={([keywords, mentionables]) => (
        <ContextProvider keywords={keywords} mentionables={mentionables}>
          {props.children}
        </ContextProvider>
      )} />
  )
}

export default AwaitDataForProject
