import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import forwardParams from '~/lib/forwardParams'
import { useContext } from '~/lib/context'

import StreamProjectData from '~/components/StreamProjectData'
import ProjectView from '~/components/layout/ProjectView'
import OverviewView from '~/components/layout/OverviewView'
import EditorView from '~/components/layout/EditorView'

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

const projectPath = projectId => `/projects/${projectId}/overview`
const documentPath = (projectId, documentId) => `/projects/${projectId}/editor/${documentId}`

const ProjectLink = ({ projectId: overrideProjectId, ...otherProps }) => {
  const { projectId: currentProject } = useContext()
  const projectId = overrideProjectId ?? currentProject
  return <Link to={projectPath(projectId)} {...otherProps} />
}

const DocumentLink = ({ projectId: overrideProjectId, documentId, ...otherProps }) => {
  const { projectId: currentProject } = useContext()
  const projectId = overrideProjectId ?? currentProject
  return <Link to={documentPath(projectId, documentId)} {...otherProps} />
}

export {
  routesComponent,
  projectPath,
  documentPath,
  ProjectLink,
  DocumentLink,
}
