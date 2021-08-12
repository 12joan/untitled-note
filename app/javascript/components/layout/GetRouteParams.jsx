import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import useLocalStorage from 'react-use-localstorage'

import { useContext } from 'lib/context'

import RouteContextProvider from 'components/layout/RouteContextProvider'

const GetRouteParams = props => (
  <Router>
    <ProjectRoute baseUrl="" params={{}} render={params => (
      <RouteContextProvider params={params}>
        {props.children}
      </RouteContextProvider>
    )} />
  </Router>
)

const ProjectRoute = props => {
  const { projects } = useContext()
  const [lastViewedProjectId, setLastViewedProjectId] = useLocalStorage('last-viewed-project', undefined)

  const initialProject = projects.find(project => project.id == lastViewedProjectId) || projects[0]

  return (
    <Switch>
      <Route path={`${props.baseUrl}/projects/:projectId`} render={({ match }) => {
        const { projectId } = match.params

        if (lastViewedProjectId !== projectId) {
          setTimeout(() => setLastViewedProjectId(projectId), 0)
        }

        return (
          <KeywordRoute
            baseUrl={match.url}
            params={{
              ...props.params,
              projectId,
            }}
            render={props.render} />
        )
      }} />

      <Redirect to={`${props.baseUrl}/projects/${initialProject.id}`} />
    </Switch>
  )
}

const KeywordRoute = props => (
  <Switch>
    <Route path={`${props.baseUrl}/keywords/:keywordId`} render={({ match }) => (
      <DocumentRoute
        baseUrl={match.url}
        params={{
          ...props.params,
          keywordId: match.params.keywordId,
        }}
        render={props.render} />
    )} />

    <Route render={() => (
      <DocumentRoute baseUrl={props.baseUrl} params={props.params} render={props.render} />
    )} />
  </Switch>
)

const DocumentRoute = props => {
  return (
    <Switch>
      <Route path={`${props.baseUrl}/documents/:documentId`} render={({ match }) => (
        props.render({
          ...props.params,
          documentId: match.params.documentId,
        })
      )} />

      <Route path={`${props.baseUrl}/documents`} render={({ match }) => (
        props.render(props.params)
      )} />

      <Redirect to={`${props.baseUrl}/documents`} />
    </Switch>
  )
}

export default GetRouteParams
