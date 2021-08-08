import React from 'react'

import { ContextProvider } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import ProjectsAPI from 'lib/resources/ProjectsAPI'

import LoadPromise from 'components/LoadPromise'

const AwaitProjects = props => {
  const [reloadProjectsKey, reloadProjects] = useRemountKey()

  return (
    <LoadPromise
      dependencies={[reloadProjectsKey]}
      promise={() => ProjectsAPI.index()}

      loading={() => <></>}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load projects:</strong> An unexpected error occurred
          </div>
        )
      }}

      success={projects => (
        <ContextProvider projects={projects} reloadProjects={reloadProjects}>
          {props.children}
        </ContextProvider>
      )} />
  )
}

export default AwaitProjects
