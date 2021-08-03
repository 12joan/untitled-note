import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import DocumentIndex from 'components/documents/DocumentIndex'

const App = props => {
  return (
    <Router>
      <div className="vh-100">
        <Switch>
          <Route exact path="/">
            <Redirect to="/documents" />
          </Route>

          <Route path="/documents">
            <DocumentIndex />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
