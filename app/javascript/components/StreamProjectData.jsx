import React from 'react'

import useStream from '~/lib/useStream'
import ProjectsStream from '~/lib/streams/ProjectsStream'
import { ContextProvider } from '~/lib/context'

const StreamProjectData = ({ projectId, children }) => {
  const futureProjects = useStream(resolve => ProjectsStream.index({}, resolve), [])
  const futureProject = futureProjects.map(projects => projects.find(project => project.id == projectId))

  return (
    <ContextProvider
      projectId={projectId}
      futureProjects={futureProjects}
      futureProject={futureProject}
      children={children}
    />
  )
}

export default StreamProjectData
