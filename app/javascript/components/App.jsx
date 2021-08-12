import React from 'react'

import AwaitProjects from 'components/layout/AwaitProjects'
import NoProjectsView from 'components/layout/NoProjectsView'
import GetRouteParams from 'components/layout/GetRouteParams'
import ProjectContextProvider from 'components/layout/ProjectContextProvider'
import AwaitKeywords from 'components/layout/AwaitKeywords'
import KeywordContextProvider from 'components/layout/KeywordContextProvider'
import InitializeContext from 'components/layout/InitializeContext'
import AppLayout from 'components/layout/AppLayout'

const App = props => {
  return (
    <AwaitProjects noProjects={() => <NoProjectsView />}>
      <GetRouteParams>
        <ProjectContextProvider>
          <AwaitKeywords>
            <KeywordContextProvider>
              <InitializeContext>
                <AppLayout />
              </InitializeContext>
            </KeywordContextProvider>
          </AwaitKeywords>
        </ProjectContextProvider>
      </GetRouteParams>
    </AwaitProjects>
  )
}

export default App
