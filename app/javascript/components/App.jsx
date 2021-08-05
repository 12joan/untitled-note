import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import RouteConfig from 'lib/RouteConfig'
import ProjectContext from 'lib/contexts/ProjectContext'
import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'
import DocumentIndex from 'components/documents/DocumentIndex'
import NewDocument from 'components/documents/NewDocument'
import ShowDocument from 'components/documents/ShowDocument'

const App = props => {
  return (
    <Router>
      <Switch>
        <Route path={RouteConfig.projects.show(':projectId').url} component={({ match }) => {
          const { projectId } = match.params

          const documentsRoutes = RouteConfig.projects.show(projectId).documents

          return (
            <ProjectContext.Provider value={projectId}>
              <div className="continer-fluid h-100 d-flex flex-column ">
                <div className="row g-0 flex-shrink-0">
                  <TopBar />
                </div>

                <div className="row g-0 flex-fill" style={{ minHeight: 0 }}>
                  <div className="col-auto mh-100 overflow-scroll">
                    <ProjectsBar />
                  </div>

                  <div className="col-auto mh-100 overflow-scroll">
                    <NavigationMenu />
                  </div>

                  <div className="col mh-100 overflow-scroll bg-light">
                    <Switch>
                      <Route path={documentsRoutes.url}>
                        <Switch>
                          <Route path={documentsRoutes.new.url}>
                            <NewDocument />
                          </Route>

                          <Route path={documentsRoutes.show(':id').url} component={({ match }) => (
                            <ShowDocument id={match.params.id} />
                          )} />

                          <Route path={documentsRoutes.url}>
                            <DocumentIndex />
                          </Route>
                        </Switch>
                      </Route>

                      <Redirect to={documentsRoutes.url} />
                    </Switch>
                  </div>
                </div>
              </div>
            </ProjectContext.Provider>
          )
        }} />

        <Redirect to={RouteConfig.projects.show(1).url} />
      </Switch>
    </Router>
  )
}

export default App
