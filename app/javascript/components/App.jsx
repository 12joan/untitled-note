import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import EventDelegateContext from 'lib/contexts/EventDelegateContext'
import RouteConfig from 'lib/RouteConfig'
import useRemountKey from 'lib/useRemountKey'
import ProjectsAPI from 'lib/resources/ProjectsAPI'
import ProjectContext from 'lib/contexts/ProjectContext'
import LoadPromise from 'components/LoadPromise'
import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NewProjectModal from 'components/projects/NewProjectModal'
import EditProjectModal from 'components/projects/EditProjectModal'
import DeleteProjectModal from 'components/projects/DeleteProjectModal'
import NavigationMenu from 'components/layout/NavigationMenu'
import DocumentIndex from 'components/documents/DocumentIndex'
import NewDocument from 'components/documents/NewDocument'
import ShowDocument from 'components/documents/ShowDocument'

const App = props => {
  const [reloadProjectsKey, reloadProjects] = useRemountKey()

  const eventDelegate = {
    reloadProjects,
  }

  return (
    <EventDelegateContext.Provider value={eventDelegate}>
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

        success={projects => {
          return (
            <Router>
              <Switch>
                <Route path={RouteConfig.projects.show(':projectId').url} component={({ match }) => {
                  const { projectId } = match.params

                  const project = projects.filter(project =>
                    project.id == projectId // '==' for lax equality checking
                  )[0]

                  if (project === undefined) {
                    return (
                      <Redirect to={RouteConfig.rootUrl} />
                    )
                  }

                  const documentsRoutes = RouteConfig.projects.show(projectId).documents

                  return (
                    <ProjectContext.Provider value={project}>
                      <div className="continer-fluid h-100 d-flex flex-column ">
                        <div className="row g-0 flex-shrink-0">
                          <TopBar />
                        </div>

                        <div className="row g-0 flex-fill" style={{ minHeight: 0 }}>
                          <div className="col-auto mh-100 overflow-scroll">
                            <ProjectsBar projects={projects} />
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

              <NewProjectModal />
              <EditProjectModal />
              <DeleteProjectModal />
            </Router>
          )
        }} />
    </EventDelegateContext.Provider>
  )
}

export default App
