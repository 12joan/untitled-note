import { useMemo, useState } from 'react';
import {
  closestCenter,
  DndContextProps,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Project, ProjectFolder } from '~/lib/types';
import { getDraggableData, getDroppableData } from '../utils';
import { announcements, screenReaderInstructions } from './accessibility';

export interface UseProjectsBarDndProps {
  projects: Project[];
  updateProject: (
    project: Project,
    folder: ProjectFolder | null,
    beforeProject: Project | null,
    afterProject: Project | null
  ) => void;
}

export const useProjectsBarDnd = ({
  projects,
  updateProject,
}: UseProjectsBarDndProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Ensures that draggables are clickable
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        start: ['Space'],
        cancel: ['Escape', 'Tab'],
        end: ['Space', 'Enter'],
      },
    })
  );

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const draggingProject = useMemo(
    () => projects.find((p) => p.id === draggingId),
    [projects, draggingId]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as number);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingId(null);
    if (!over) return;

    const activeData = getDraggableData(active);
    const overData = getDroppableData(over);

    if (activeData.type === 'project' && overData.type === 'project-position') {
      const { project: activeProject } = activeData;
      const { project, side, folder } = overData;
      const referenceProjectIndex = projects.findIndex(
        (p) => p.id === project.id
      );
      const offset = side === 'before' ? -1 : 1;
      const otherProjectIndex = referenceProjectIndex + offset;
      const otherProject = projects[otherProjectIndex] ?? null;
      const beforeProject = side === 'before' ? otherProject : project;
      const afterProject = side === 'after' ? otherProject : project;
      updateProject(activeProject, folder, beforeProject, afterProject);
    }

    if (activeData.type === 'project' && overData.type === 'project-folder') {
      const { project } = activeData;
      const { folder } = overData;
      const beforeProject = projects[projects.length - 1];
      updateProject(project, folder, beforeProject, null);
    }
  };

  const dndContextProps: DndContextProps = {
    sensors,
    collisionDetection: closestCenter,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    accessibility: {
      screenReaderInstructions,
      announcements,
    },
  };

  return { draggingProject, dndContextProps };
};
