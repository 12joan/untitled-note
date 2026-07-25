import { useDraggable } from '@dnd-kit/core';
import type { Project } from '~/lib/types';
import type { DraggableData } from '../types';
import { describeProject } from './accessibility';

export const useDraggableProject = (project: Project) =>
  useDraggable({
    id: `project-${project.id}`,
    attributes: {
      role: 'link',
      roleDescription: 'sortable project',
    },
    data: {
      type: 'project',
      project,
      description: describeProject(project),
    } satisfies DraggableData,
  });
