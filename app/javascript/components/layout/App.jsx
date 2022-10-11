import React from 'react'
import { useReducer } from 'react'

import useStream from '~/lib/useStream'
import ProjectsStream from '~/lib/streams/ProjectsStream'
import { ContextProvider } from '~/lib/context'
import { routesComponent } from '~/lib/routes'

import ErrorBoundary from '~/components/ErrorBoundary'
import LoadingView from '~/components/LoadingView'
import ToastContainer from '~/components/layout/ToastContainer'

const App = () => {
  const [projectsCacheKey, invalidateProjectsCache] = useReducer(x => x + 1, 0)
  const futureProjects = useStream(resolve => ProjectsStream.index({}, resolve), [projectsCacheKey])

  const fallback = (
    <div className="p-5 space-y-3">
      <h1 className="text-3xl font-medium">An internal error has occurred</h1>
      {/* TODO: Add contact details */}
      <p className="text-lg font-light">This probably isn't your fault. Let us know if the problem persists.</p>
      <p><a href="/" className="btn btn-link font-medium">Go back to the home page</a></p>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      {futureProjects.map(projects => projects.length === 0
        ? 'No projects found' // TODO
        : (
          <ContextProvider projects={projects} invalidateProjectsCache={invalidateProjectsCache}>
            {routesComponent}
            <ToastContainer />
          </ContextProvider>
        )
      ).orDefault(<LoadingView />)}
    </ErrorBoundary>
  )
}

export default App
