import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '~/lib/appContext';
import { getLastOpenedProject } from '~/lib/projectHistory';
import { projectPath } from '~/lib/routes';

export const RestoreLastOpenProject = () => {
  const projects = useAppContext('projects');
  const projectId = getLastOpenedProject() ?? projects[0]?.id;
  return <Navigate to={projectPath({ projectId })} replace />;
};
