import React from 'react'
import { BrowserRouter as Switch, Route, Redirect } from 'react-router-dom'
import DocumentIndex from 'components/documents/DocumentIndex'

const ContentArea = props => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/documents" />
      </Route>

      <Route path="/documents">
        <DocumentIndex />
      </Route>
    </Switch>
  )
}

export default ContentArea
