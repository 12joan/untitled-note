import React from 'react'

import { useContext, ContextProvider } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import KeywordsAPI from 'lib/resources/KeywordsAPI'

import LoadPromise from 'components/LoadPromise'
import AppPlaceholder from 'components/layout/AppPlaceholder'

const AwaitKeywords = props => {
  const { projectId } = useContext()

  const [reloadKeywordsKey, reloadKeywords] = useRemountKey()

  return (
    <LoadPromise
      dependencies={[projectId, reloadKeywordsKey]}
      promise={() => KeywordsAPI(projectId).index()}

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
        <ContextProvider keywords={keywords} reloadKeywordsKey={reloadKeywordsKey} reloadKeywords={reloadKeywords}>
          {props.children}
        </ContextProvider>
      )} />
  )
}

export default AwaitKeywords
