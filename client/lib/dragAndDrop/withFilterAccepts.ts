import { CollisionDetection } from '@dnd-kit/core';
import { acceptsMap } from './acceptsMap';
import { getDraggableData, getDroppableData } from './utils';

export const withFilterAccepts =
  (baseStrategy: CollisionDetection): CollisionDetection =>
  (args) => {
    const { active, droppableRects, droppableContainers } = args;
    const { type: activeType } = getDraggableData(active);
    const validOverTypes = acceptsMap[activeType];

    const validDroppableContainers: typeof droppableContainers =
      droppableContainers.filter((over) =>
        validOverTypes.includes(getDroppableData(over).type)
      );

    const validDroppableRects: typeof droppableRects = new Map(
      Array.from(droppableRects).filter(([id]) =>
        validDroppableContainers.some(({ id: validId }) => validId === id)
      )
    );

    return baseStrategy({
      ...args,
      droppableRects: validDroppableRects,
      droppableContainers: validDroppableContainers,
    });
  };
