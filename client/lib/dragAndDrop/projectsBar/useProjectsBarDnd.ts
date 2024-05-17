import { useState } from 'react';
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
import { withFilterAccepts } from '../withFilterAccepts';
import { announcements, screenReaderInstructions } from './accessibility';

export interface UseProjectsBarDndProps {
  projects: Project[];
  folders: ProjectFolder[];
  updateProject: (
    project: Project,
    folder: ProjectFolder | null,
    beforeProject: Project | null,
    afterProject: Project | null
  ) => void;
  updateProjectFolder: (
    folder: ProjectFolder,
    beforeFolder: ProjectFolder | null,
    afterFolder: ProjectFolder | null
  ) => void;
}

export const useProjectsBarDnd = ({
  projects,
  folders,
  updateProject,
  updateProjectFolder,
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

  const [draggingProject, setDraggingProject] = useState<Project | null>(null);
  const [draggingFolder, setDraggingFolder] = useState<ProjectFolder | null>(
    null
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = getDraggableData(event.active);

    if (data.type === 'project') {
      setDraggingProject(data.project);
    }

    if (data.type === 'project-folder') {
      setDraggingFolder(data.folder);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingProject(null);
    setDraggingFolder(null);

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

    if (
      activeData.type === 'project-folder' &&
      overData.type === 'project-folder-position'
    ) {
      const { folder: activeFolder } = activeData;
      const { folder, side } = overData;
      const referenceFolderIndex = folders.findIndex(
        (pf) => pf.id === folder.id
      );
      const offset = side === 'before' ? -1 : 1;
      const otherFolderIndex = referenceFolderIndex + offset;
      const otherFolder = folders[otherFolderIndex] ?? null;
      const beforeFolder = side === 'before' ? otherFolder : folder;
      const afterFolder = side === 'after' ? otherFolder : folder;
      updateProjectFolder(activeFolder, beforeFolder, afterFolder);
    }
  };

  const dndContextProps: DndContextProps = {
    sensors,
    collisionDetection: withFilterAccepts(closestCenter),
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    accessibility: {
      screenReaderInstructions,
      announcements,
    },
  };

  return { draggingProject, draggingFolder, dndContextProps };
};
