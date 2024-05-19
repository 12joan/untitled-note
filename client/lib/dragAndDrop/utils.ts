import { Active, DroppableContainer, Over } from '@dnd-kit/core';
import { DraggableData, DroppableData } from './types';

export const getDraggableData = <T extends Active | undefined | null>(
  active: T
): T extends Active ? DraggableData : DraggableData | null => {
  if (!active) return null as any;
  return active.data.current as any;
};

export const getDroppableData = <
  T extends Over | DroppableContainer | undefined | null
>(
  over: T
): T extends Over | DroppableContainer
  ? DroppableData
  : DroppableData | null => {
  if (!over) return null as any;
  return over.data.current as any;
};
