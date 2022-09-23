import React, { forwardRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import forwardParams from '~/lib/forwardParams'
import { useContext } from '~/lib/context'

import StreamProjectData from '~/components/StreamProjectData'
import ProjectView from '~/components/layout/ProjectView'
import Link from '~/components/Link'

const routesComponent = (
  <Routes>
    <Route path="/projects/:projectId/*" element={forwardParams(({ projectId }) => (
      <StreamProjectData projectId={projectId}>
        <Routes>
          <Route path="overview" element={(
            <ProjectView childView={{ type: 'overview', key: 'overview', props: {} }} />
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

const projectPath = projectId => `/projects/${projectId}`
const overviewPath = projectId => `/projects/${projectId}/overview`
const newDocumentPath = projectId => `/projects/${projectId}/editor/new`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`

const makeLinkComponent = pathFunc => forwardRef(({ projectId: overrideProjectId, documentId, ...otherProps }, ref) => {
  const { projectId: currentProject } = useContext()
  const projectId = overrideProjectId ?? currentProject
  return <Link ref={ref} to={pathFunc(projectId, documentId)} {...otherProps} />
})

const ProjectLink = makeLinkComponent(projectPath)
const OverviewLink = makeLinkComponent(overviewPath)
const NewDocumentLink = makeLinkComponent(newDocumentPath)
const DocumentLink = makeLinkComponent(documentPath)
const RecentlyViewedDocumentLink = makeLinkComponent((...args) => `${documentPath(...args)}?recently_viewed`)

export {
  routesComponent,
  projectPath,
  documentPath,
  ProjectLink,
  OverviewLink,
  NewDocumentLink,
  DocumentLink,
  RecentlyViewedDocumentLink,
}
