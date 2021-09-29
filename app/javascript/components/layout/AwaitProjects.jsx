import React from 'react'

import { ContextProvider } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import ProjectsStream from 'lib/streams/ProjectsStream'

import LoadAsync from 'components/LoadAsync'
import AppPlaceholder from 'components/layout/AppPlaceholder'

const AwaitProjects = props => {
  const [reloadProjectsKey, reloadProjects] = useRemountKey()

  return (
    <LoadAsync
      dependenciesRequiringClear={[reloadProjectsKey]}

      provider={(resolve, reject) => {
        const subscription = ProjectsStream.index({}, resolve)
        return () => subscription.unsubscribe()
      }}

      loading={() => <AppPlaceholder />}

      error={error => {
        console.error(error)

        return (
          <>
            <div className="alert alert-danger">
              <strong>Failed to load projects:</strong> An unexpected error occurred
            </div>
          </>
        )
      }}

      success={projects => (
        <ContextProvider projects={projects} reloadProjects={reloadProjects}>
          {
            projects.length === 0
              ? props.noProjects()
              : props.children
          }
        </ContextProvider>
      )} />
  )
}

export default AwaitProjects
