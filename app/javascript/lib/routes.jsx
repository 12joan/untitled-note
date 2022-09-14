import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import forwardParams from '~/lib/forwardParams'
import { useContext } from '~/lib/context'

import StreamProjectData from '~/components/StreamProjectData'
import ProjectView from '~/components/layout/ProjectView'
import OverviewView from '~/components/layout/OverviewView'
import EditorView from '~/components/layout/EditorView'
import Link from '~/components/Link'

const routesComponent = (
  <Routes>
    <Route path="/projects/:projectId/*" element={forwardParams(({ projectId }) => (
      <StreamProjectData projectId={projectId}>
        <Routes>
          <Route path="overview/*" element={(
            <ProjectView childView={{ type: 'overview', props: {} }} />
          )} />

          <Route path="editor/:documentId/*" element={forwardParams(({ documentId }) => (
            <ProjectView childView={{ type: 'editor', props: { documentId } }} />
          ))} />

          <Route path="*" element={<Navigate to={`/projects/${projectId}/overview`} />} />
        </Routes>
      </StreamProjectData>
    ))} />

    <Route path="*" element={<Navigate to="/projects/1/overview" />} />
  </Routes>
)

const projectPath = projectId => `/projects/${projectId}`
const overviewPath = projectId => `/projects/${projectId}/overview`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`

const makeLinkComponent = pathFunc => ({ projectId: overrideProjectId, documentId, ...otherProps }) => {
  const { projectId: currentProject } = useContext()
  const projectId = overrideProjectId ?? currentProject
  return <Link to={pathFunc(projectId, documentId)} {...otherProps} />
}

const ProjectLink = makeLinkComponent(projectPath)
const OverviewLink = makeLinkComponent(overviewPath)
const DocumentLink = makeLinkComponent(documentPath)

export {
  routesComponent,
  projectPath,
  documentPath,
  ProjectLink,
  OverviewLink,
  DocumentLink,
}
