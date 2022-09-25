import React, { forwardRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import forwardParams from '~/lib/forwardParams'
import { useContext } from '~/lib/context'

import { AwaitRedirectComponent } from '~/lib/awaitRedirect'
import StreamProjectData from '~/components/StreamProjectData'
import ProjectView from '~/components/layout/ProjectView'
import Link from '~/components/Link'

const routesComponent = (
  <Routes>
    <Route path="/await_redirect" element={<AwaitRedirectComponent />} />

    <Route path="/projects/:projectId/*" element={forwardParams(({ projectId }) => (
      <StreamProjectData projectId={projectId}>
        <Routes>
          <Route path="overview" element={(
            <ProjectView childView={{ type: 'overview', key: 'overview', props: {} }} />
          )} />

          <Route path="edit" element={(
            <ProjectView childView={{ type: 'editProject', key: 'editProject', props: {} }} />
          )} />

          <Route path="recently_viewed" element={(
            <ProjectView childView={{ type: 'recentlyViewed', key: 'recentlyViewed', props: {} }} />
          )} />

          <Route path="editor/new" element={(
            <ProjectView childView={{ type: 'newDocument', key: 'newDocument', props: {} }} />
          )} />

          <Route path="editor/:documentId" element={forwardParams(({ documentId }) => (
            <ProjectView childView={{ type: 'editor', key: `editor/${documentId}`, props: { documentId: parseInt(documentId) } }} />
          ))} />

          <Route path="*" element={<Navigate to={`/projects/${projectId}/overview`} replace />} />
        </Routes>
      </StreamProjectData>
    ))} />

    <Route path="*" element={<Navigate to="/projects/1/overview" replace />} />
  </Routes>
)

const makeLinkComponent = pathFunc => forwardRef(({ projectId: overrideProjectId, documentId, ...otherProps }, ref) => {
  const { projectId: currentProject, linkOriginator } = useContext()
  const projectId = overrideProjectId ?? currentProject

  return (
    <Link
      ref={ref}
      to={pathFunc(projectId, documentId)}
      state={{ linkOriginator }}
      {...otherProps}
    />
  )
})

const awaitRedirectPath = '/await_redirect'
const overviewPath = projectId => `/projects/${projectId}/overview`
const projectPath = overviewPath
const editProjectPath = projectId => `/projects/${projectId}/edit`
const newDocumentPath = projectId => `/projects/${projectId}/editor/new`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`
const recentlyViewedDocumentPath = (...args) => `${documentPath(...args)}?recently_viewed`
const recentlyViewedPath = projectId => `/projects/${projectId}/recently_viewed`

const OverviewLink = makeLinkComponent(overviewPath)
const ProjectLink = makeLinkComponent(projectPath)
const EditProjectLink = makeLinkComponent(editProjectPath)
const NewDocumentLink = makeLinkComponent(newDocumentPath)
const DocumentLink = makeLinkComponent(documentPath)
const RecentlyViewedDocumentLink = makeLinkComponent(recentlyViewedDocumentPath)
const RecentlyViewedLink = makeLinkComponent(recentlyViewedPath)

export {
  routesComponent,
  awaitRedirectPath,
  projectPath,
  overviewPath,
  editProjectPath,
  newDocumentPath,
  documentPath,
  recentlyViewedDocumentPath,
  recentlyViewedPath,
  ProjectLink,
  OverviewLink,
  EditProjectLink,
  NewDocumentLink,
  DocumentLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
}
