import React from 'react'

import useTitle from 'lib/useTitle'

import AwaitProjects from 'components/layout/AwaitProjects'
import NoProjectsView from 'components/layout/NoProjectsView'
import GetRouteParams from 'components/layout/GetRouteParams'
import ProjectContextProvider from 'components/layout/ProjectContextProvider'
import AwaitKeywords from 'components/layout/AwaitKeywords'
import KeywordContextProvider from 'components/layout/KeywordContextProvider'
import InitializeContext from 'components/layout/InitializeContext'
import KeyboardShortcutHandler from 'components/layout/KeyboardShortcutHandler'
import AppLayout from 'components/layout/AppLayout'

const App = props => {
  useTitle('Note App')

  return (
    <AwaitProjects noProjects={() => <NoProjectsView />}>
      <GetRouteParams>
        <ProjectContextProvider>
          <AwaitKeywords>
            <KeywordContextProvider>
              <InitializeContext>
                <KeyboardShortcutHandler>
                  <AppLayout />
                </KeyboardShortcutHandler>
              </InitializeContext>
            </KeywordContextProvider>
          </AwaitKeywords>
        </ProjectContextProvider>
      </GetRouteParams>
    </AwaitProjects>
  )
}

export default App
