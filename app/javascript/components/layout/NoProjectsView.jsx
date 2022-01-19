import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import useTitle from 'lib/useTitle'

import SetBodyBackground from 'components/SetBodyBackground'
import NewProjectForm from 'components/projects/NewProjectForm'

const NoProjectsView = props => {
  useTitle('Welcome', { layer: 1 })

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <SetBodyBackground background="var(--bs-light)">
            <div className="container h-100 d-flex flex-column" style={{ maxWidth: '768px' }}>
              <div className="my-auto py-3">
                <h1>Welcome to Note App</h1>
                <p className="lead">To get started, create a new project. <a href="#">Learn more</a></p>
                <NewProjectForm />
              </div>
            </div>
          </SetBodyBackground>
        </Route>

        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default NoProjectsView
