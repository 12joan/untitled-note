import React from 'react'

import { useContext, ContextProvider } from 'lib/context'

import RunOnMount from 'components/RunOnMount'

const ProjectContextProvider = props => {
  const { projectId, projects, setParams } = useContext()

  const currentProject = projects.filter(project =>
    project.id == projectId // '==' for lax equality checking
  )[0]

  if (currentProject === undefined) {
    return (
      <RunOnMount onMount={() => setParams({ projectId: undefined, keywordId: undefined, documentId: undefined })} />
    )
  }

  return (
    <ContextProvider project={currentProject}>
      {props.children}
    </ContextProvider>
  )
}

export default ProjectContextProvider
