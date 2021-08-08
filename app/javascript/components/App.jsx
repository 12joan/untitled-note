import React from 'react'

import AwaitProjects from 'components/layout/AwaitProjects'
import GetRouteParams from 'components/layout/GetRouteParams'
import ProjectContextProvider from 'components/layout/ProjectContextProvider'
import AwaitKeywords from 'components/layout/AwaitKeywords'
import KeywordContextProvider from 'components/layout/KeywordContextProvider'
import SortParameterContextProvider from 'components/layout/SortParameterContextProvider'
import AppLayout from 'components/layout/AppLayout'

const App = props => {
  return (
    <AwaitProjects>
      <GetRouteParams>
        <ProjectContextProvider>
          <AwaitKeywords>
            <KeywordContextProvider>
              <SortParameterContextProvider>
                <AppLayout />
              </SortParameterContextProvider>
            </KeywordContextProvider>
          </AwaitKeywords>
        </ProjectContextProvider>
      </GetRouteParams>
    </AwaitProjects>
  )
}

export default App
