import { DraggableType, DroppableType } from './types';

export const acceptsMap: Record<DraggableType, DroppableType[]> = {
  project: ['project-position', 'project-folder'],
  'project-folder': ['project-folder-position'],
};
