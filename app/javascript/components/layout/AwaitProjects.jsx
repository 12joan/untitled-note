import React from 'react'
import { useState } from 'react'

import { ContextProvider } from 'lib/context'
import useRemountKey from 'lib/useRemountKey'
import ProjectsAPI from 'lib/resources/ProjectsAPI'

import LoadPromise from 'components/LoadPromise'
import RunOnMount from 'components/RunOnMount'

const AwaitProjects = props => {
  const [reloadProjectsKey, reloadProjects] = useRemountKey()
  const [projectsUpdatedKey, projectsUpdated] = useRemountKey()
  const [promiseCallbacks, setPromiseCallbacks] = useState(undefined)

  const reloadProjectsAndWait = () => {
    return new Promise((resolve, reject) => {
      setPromiseCallbacks({ resolve, reject })
      reloadProjects()
    })
  }

  return (
    <LoadPromise
      dependencies={[reloadProjectsKey]}
      promise={() => {
        return ProjectsAPI.index()
          .then(projects => {
            projectsUpdated()
            return projects
          })
          .catch(error => {
            projectsUpdated()
            return Promise.reject(error)
          })
      }}

      loading={() => <></>}

      error={error => {
        console.error(error)

        promiseCallbacks?.reject(error)
        setPromiseCallbacks(undefined)

        return (
          <>
            <RunOnMount onMount={() => {
              promiseCallbacks?.reject()
              setPromiseCallbacks(undefined)
            }} dependencies={[projectsUpdatedKey]} />

            <div className="alert alert-danger">
              <strong>Failed to load projects:</strong> An unexpected error occurred
            </div>
          </>
        )
      }}

      success={projects => (
        <ContextProvider projects={projects} reloadProjects={reloadProjectsAndWait}>
          <RunOnMount onMount={() => {
            promiseCallbacks?.resolve(projects)
            setPromiseCallbacks(undefined)
          }} dependencies={[projectsUpdatedKey]} />

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
