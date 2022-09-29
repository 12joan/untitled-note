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
          <Route path="await_redirect" element={(
            <ProjectView childView={{ type: 'awaitRedirect', key: 'awaitRedirect', props: {} }} />
          )} />

          <Route path="overview" element={(
            <ProjectView childView={{ type: 'overview', key: 'overview', props: {} }} />
          )} />

          <Route path="edit" element={(
            <ProjectView childView={{ type: 'editProject', key: 'editProject', props: {} }} />
          )} />

          <Route path="recently_viewed" element={(
            <ProjectView childView={{ type: 'recentlyViewed', key: 'recentlyViewed', props: {} }} />
          )} />

          <Route path="tags/:tagId" element={forwardParams(({ tagId }) => (
            <ProjectView childView={{ type: 'showTag', key: `tags/${tagId}`, props: { tagId: parseInt(tagId) } }} />
          ))} />

          <Route path="tags" element={(
            <ProjectView childView={{ type: 'allTags', key: 'allTags', props: {} }} />
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

const makeLinkComponent = pathFunc => forwardRef(({ projectId: overrideProjectId, documentId, tagId, ...otherProps }, ref) => {
  const { projectId: currentProject, linkOriginator } = useContext()
  const projectId = overrideProjectId ?? currentProject

  return (
    <Link
      ref={ref}
      to={pathFunc(projectId, documentId ?? tagId)}
      state={{ linkOriginator }}
      {...otherProps}
    />
  )
})

const awaitRedirectPath = projectId => projectId ? `/projects/${projectId}/await_redirect` : '/await_redirect'
const overviewPath = projectId => `/projects/${projectId}/overview`
const projectPath = overviewPath
const editProjectPath = projectId => `/projects/${projectId}/edit`
const recentlyViewedPath = projectId => `/projects/${projectId}/recently_viewed`
const tagPath = (projectId, tagId) => `/projects/${projectId}/tags/${tagId}`
const tagsPath = projectId => `/projects/${projectId}/tags`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`
const recentlyViewedDocumentPath = (...args) => `${documentPath(...args)}?recently_viewed`

const OverviewLink = makeLinkComponent(overviewPath)
const ProjectLink = makeLinkComponent(projectPath)
const EditProjectLink = makeLinkComponent(editProjectPath)
const RecentlyViewedLink = makeLinkComponent(recentlyViewedPath)
const TagLink = makeLinkComponent(tagPath)
const TagsLink = makeLinkComponent(tagsPath)
const DocumentLink = makeLinkComponent(documentPath)
const RecentlyViewedDocumentLink = makeLinkComponent(recentlyViewedDocumentPath)

export {
  routesComponent,
  awaitRedirectPath,
  projectPath,
  overviewPath,
  editProjectPath,
  recentlyViewedPath,
  tagPath,
  tagsPath,
  documentPath,
  recentlyViewedDocumentPath,
  ProjectLink,
  OverviewLink,
  EditProjectLink,
  RecentlyViewedLink,
  TagLink,
  TagsLink,
  DocumentLink,
  RecentlyViewedDocumentLink,
}
