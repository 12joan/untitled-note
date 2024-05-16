import { Project, ProjectFolder } from '~/lib/types';

export type BaseDraggableData = {
  type: string;
  description: string;
};

export type ProjectDraggableData = BaseDraggableData & {
  type: 'project';
  project: Project;
};

export type DraggableData = ProjectDraggableData;

export type BaseDroppableData = {
  type: string;
  description: string;
};

export type ProjectPositionDroppableData = BaseDroppableData & {
  type: 'project-position';
  project: Project;
  side: 'before' | 'after';
  folder: ProjectFolder | null;
};

export type ProjectFolderDroppableData = BaseDroppableData & {
  type: 'project-folder';
  folder: ProjectFolder | null;
};

export type DroppableData =
  | ProjectPositionDroppableData
  | ProjectFolderDroppableData;
