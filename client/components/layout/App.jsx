import React, { useReducer } from 'react'

import useStream from '~/lib/useStream'
import ProjectsStream from '~/lib/streams/ProjectsStream'
import FileStorageStream from '~/lib/streams/FileStorageStream'
import { ContextProvider } from '~/lib/context'
import { ApplicationRoutes } from '~/lib/routes'

import ErrorBoundary from '~/components/ErrorBoundary'
import NoProjectsView from '~/components/layout/NoProjectsView'
import LoadingView from '~/components/LoadingView'
import ToastContainer from '~/components/layout/ToastContainer'

const App = () => {
  const [projectsCacheKey, invalidateProjectsCache] = useReducer(x => x + 1, 0)
  const futureProjects = useStream(resolve => ProjectsStream.index({}, resolve), [projectsCacheKey])

  const futureQuotaUsage = useStream(resolve => FileStorageStream.quotaUsage(resolve), [])
  const futureFiles = useStream(resolve => FileStorageStream.files(resolve), [])
  const futureRemainingQuota = futureQuotaUsage.map(({ quota, used }) => quota - used)

  const fallback = (
    <div className="p-5 space-y-3">
      <h1 className="h1">An internal error has occurred</h1>
      {/* TODO: Add contact details */}
      <p className="text-lg font-light">This probably isn't your fault. Let us know if the problem persists.</p>
      <p><a href="/" className="btn btn-link font-medium">Go back to the home page</a></p>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      {futureProjects.map(projects => (
        <ContextProvider
          projects={projects}
          invalidateProjectsCache={invalidateProjectsCache}
          futureQuotaUsage={futureQuotaUsage}
          futureFiles={futureFiles}
          futureRemainingQuota={futureRemainingQuota}
        >
          {projects.length === 0
            ? <NoProjectsView />
            : (
              <>
                <ApplicationRoutes />
                <ToastContainer />
              </>
            )
          }
        </ContextProvider>
      )).orDefault(<LoadingView />)}
    </ErrorBoundary>
  )
}

export default App
