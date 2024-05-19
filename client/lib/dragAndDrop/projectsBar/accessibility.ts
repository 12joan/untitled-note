import { Announcements, ScreenReaderInstructions } from '@dnd-kit/core';
import { Project, ProjectFolder } from '~/lib/types';
import { getDraggableData, getDroppableData } from '../utils';

export const describeProject = ({ name }: Project) => `project "${name}"`;
export const describeProjectFolder = ({ name }: ProjectFolder) =>
  `folder "${name}"`;

export const describeProjectPosition = (
  before: Project | null,
  after: Project | null
) => {
  if (before && after) {
    return `between projects "${before.name}" and "${after.name}"`;
  }

  if (before) {
    return `after ${describeProject(before)}`;
  }

  if (after) {
    return `before ${describeProject(after)}`;
  }

  throw new Error('Invalid project position');
};

export const describeProjectFolderPosition = (
  before: ProjectFolder | null,
  after: ProjectFolder | null
) => {
  if (before && after) {
    return `between folders "${before.name}" and "${after.name}"`;
  }

  if (before) {
    return `after ${describeProjectFolder(before)}`;
  }

  if (after) {
    return `before ${describeProjectFolder(after)}`;
  }

  throw new Error('Invalid project folder position');
};

export const announcements: Announcements = {
  onDragStart: ({ active }) => {
    const draggable = getDraggableData(active).description;
    return `Picked up ${draggable}`;
  },

  onDragOver: ({ active, over }) => {
    const draggable = getDraggableData(active).description;

    if (over) {
      const droppable = getDroppableData(over).description;
      return `Moved ${draggable} ${droppable}`;
    }

    return `${draggable} is no longer over a droppable area`;
  },

  onDragEnd: ({ active, over }) => {
    const draggable = getDraggableData(active).description;

    if (over) {
      const droppable = getDroppableData(over).description;
      return `Dropped ${draggable} ${droppable}`;
    }

    return `Dropped ${draggable}`;
  },

  onDragCancel: ({ active }) => {
    const draggable = getDraggableData(active).description;
    return `Cancelled dragging ${draggable}`;
  },
};

export const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    'To pick up a project, press the space bar. While dragging, use the arrow keys to move the project to its new position or over a folder. Press space again to drop the project in its new position, or press escape to cancel.',
};
