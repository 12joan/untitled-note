import { useDraggable } from '@dnd-kit/core';
import { ProjectFolder } from '~/lib/types';
import { DraggableData } from '../types';
import { describeProjectFolder } from './accessibility';

export const useDraggableProjectFolder = (folder: ProjectFolder) =>
  useDraggable({
    id: `folder-${folder.id}`,
    attributes: {
      role: 'link',
      roleDescription: 'sortable folder',
    },
    data: {
      type: 'project-folder',
      folder,
      description: describeProjectFolder(folder),
    } satisfies DraggableData,
  });
