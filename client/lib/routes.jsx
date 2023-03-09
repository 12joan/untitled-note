import React, { forwardRef } from 'react'
import { Routes, Navigate, useRoutes } from 'react-router-dom'

import { useContext } from '~/lib/context'
import { getLastView } from '~/lib/restoreProjectView'

import forwardParams from '~/lib/forwardParams'
import AwaitRedirect from '~/components/AwaitRedirect'
import StreamProjectData from '~/components/StreamProjectData'
import ProjectView from '~/components/layout/ProjectView'
import RestoreLastOpenProject from '~/components/RestoreLastOpenProject'
import Link from '~/components/Link'

// To keep the component tree consistent, we need to use forwardParams on all
// routes, even if they don't have any params. Otherwise, React will remount
// the ProjectView component when the view or project changes.

const ApplicationRoutes = () => {
  const routesComponent = useRoutes([
    {
      path: '/await_redirect',
      element: forwardParams(() => <AwaitRedirect />),
    },
    {
      path: '/projects/:projectId/*',
      element: forwardParams(({ projectId }) => (
        <StreamProjectData projectId={parseInt(projectId)}>
          <ProjectRoutes projectId={projectId} />
        </StreamProjectData>
      )),
    },
    {
      path: '*',
      element: forwardParams(() => <RestoreLastOpenProject />),
    },
  ])

  return routesComponent
}

const ProjectRoutes = ({ projectId }) => {
  const routesComponent = useRoutes([
    {
      path: 'await_redirect',
      element: forwardParams(() => (
        <ProjectView childView={{ type: 'awaitRedirect', key: 'awaitRedirect', props: {} }} />
      )),
    },
    {
      path: 'overview',
      element: forwardParams(() => (
        <ProjectView childView={{ type: 'overview', key: 'overview', props: {} }} />
      )),
    },
    {
      path: 'edit',
      element: forwardParams(() => (
        <ProjectView childView={{ type: 'editProject', key: 'editProject', props: {} }} />
      )),
    },
    {
      path: 'recently_viewed',
      element: forwardParams(() => (
        <ProjectView childView={{ type: 'recentlyViewed', key: 'recentlyViewed', props: {} }} />
      )),
    },
    {
      path: 'tags/:tagId',
      element: forwardParams(({ tagId }) => (
        <ProjectView childView={{ type: 'showTag', key: `tags/${tagId}`, props: { tagId: parseInt(tagId) } }} />
      )),
    },
    {
      path: 'tags',
      element: forwardParams(() => (
        <ProjectView childView={{ type: 'allTags', key: 'allTags', props: {} }} />
      )),
    },
    {
      path: 'editor/:documentId',
      element: forwardParams(({ documentId }) => (
        <ProjectView childView={{ type: 'editor', key: `editor/${documentId}`, props: { documentId: parseInt(documentId) } }} />
      )),
    },
    {
      path: '*',
      element: forwardParams(() => (
        <Navigate to={`/projects/${projectId}/overview`} replace />
      )),
    },
  ])

  return routesComponent
}

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

const logoutPath = '/auth/logout'
const awaitRedirectPath = projectId => projectId ? `/projects/${projectId}/await_redirect` : '/await_redirect'
const overviewPath = projectId => `/projects/${projectId}/overview`
const projectPath = projectId => getLastView(projectId) ?? overviewPath(projectId)
const editProjectPath = projectId => `/projects/${projectId}/edit`
const recentlyViewedPath = projectId => `/projects/${projectId}/recently_viewed`
const tagPath = (projectId, tagId) => `/projects/${projectId}/tags/${tagId}`
const tagsPath = projectId => `/projects/${projectId}/tags`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`
const recentlyViewedDocumentPath = (...args) => `${documentPath(...args)}?recently_viewed`

const LogoutLink = forwardRef(({ ...otherProps }, ref) => <a ref={ref} href={logoutPath} {...otherProps} />)
const OverviewLink = makeLinkComponent(overviewPath)
const ProjectLink = makeLinkComponent(projectPath)
const EditProjectLink = makeLinkComponent(editProjectPath)
const RecentlyViewedLink = makeLinkComponent(recentlyViewedPath)
const TagLink = makeLinkComponent(tagPath)
const TagsLink = makeLinkComponent(tagsPath)
const DocumentLink = makeLinkComponent(documentPath)
const RecentlyViewedDocumentLink = makeLinkComponent(recentlyViewedDocumentPath)

export {
  ApplicationRoutes,
  logoutPath,
  awaitRedirectPath,
  projectPath,
  overviewPath,
  editProjectPath,
  recentlyViewedPath,
  tagPath,
  tagsPath,
  documentPath,
  recentlyViewedDocumentPath,
  LogoutLink,
  OverviewLink,
  ProjectLink,
  EditProjectLink,
  RecentlyViewedLink,
  TagLink,
  TagsLink,
  DocumentLink,
  RecentlyViewedDocumentLink,
}
