import React from 'react'
import { Navigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import { getLastOpenedProject } from '~/lib/projectHistory'
import { projectPath } from '~/lib/routes'

import LoadingView from '~/components/LoadingView'

const RestoreLastOpenProject = () => {
  const { projects } = useContext()
  const projectId = getLastOpenedProject() ?? projects[0]?.id
  return <Navigate to={projectPath(projectId)} replace />
}

export default RestoreLastOpenProject
