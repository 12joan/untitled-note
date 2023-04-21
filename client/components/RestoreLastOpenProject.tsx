import React from 'react'
import { Navigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import { getLastOpenedProject } from '~/lib/projectHistory'
import { projectPath } from '~/lib/routes'
import { Project } from '~/lib/types'

export const RestoreLastOpenProject = () => {
  const { projects } = useContext() as { projects: Project[] }
  const projectId = getLastOpenedProject() ?? projects[0]?.id
  return <Navigate to={projectPath({ projectId })} replace />
}
