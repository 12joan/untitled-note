import { useDndContext, useDroppable } from '@dnd-kit/core';
import { ProjectFolder } from '~/lib/types';
import { DroppableData } from '../types';
import { getDroppableData } from '../utils';

export const useDroppableProjectFolder = (folder: ProjectFolder) => {
  const { isOver: isDragOver, setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: 'project-folder',
      folder,
      description: `onto ${folder.name}`,
    } satisfies DroppableData,
  });

  const overData = getDroppableData(useDndContext().over);
  const isDragInside =
    overData?.type === 'project-position' && overData.folder === folder;
  const isDragOverOrInside = isDragOver || isDragInside;

  return {
    setNodeRef,
    isDragOver,
    isDragOverOrInside,
  };
};
