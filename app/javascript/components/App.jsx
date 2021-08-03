import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import TopBar from 'components/layout/TopBar'
import ProjectsBar from 'components/layout/ProjectsBar'
import NavigationMenu from 'components/layout/NavigationMenu'
import DocumentIndex from 'components/documents/DocumentIndex'
import NewDocument from 'components/documents/NewDocument'
import ShowDocument from 'components/documents/ShowDocument'

const App = props => {
  return (
    <Router>
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
              <Route path="/documents">
                <Switch>
                  <Route path="/documents/new">
                    <NewDocument />
                  </Route>

                  <Route path="/documents/:id" component={({ match }) => (
                    <ShowDocument id={match.params.id} />
                  )} />

                  <Route path="/documents">
                    <DocumentIndex />
                  </Route>
                </Switch>
              </Route>

              <Redirect from="/" to="/documents" />
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
