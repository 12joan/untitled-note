import React from 'react';
import { EditProjectIcon } from '~/components/EditProjectIcon';
import { EditProjectName } from '~/components/EditProjectName';

export const ProjectDetailsSection = () => {
  return (
    <>
      <EditProjectName />
      <EditProjectIcon />
    </>
  );
};
