import { Project, ProjectFolder } from '~/lib/types';

export type BaseDraggableData = {
  type: string;
  description: string;
};

export type ProjectDraggableData = BaseDraggableData & {
  type: 'project';
  project: Project;
};

export type ProjectFolderDraggableData = BaseDraggableData & {
  type: 'project-folder';
  folder: ProjectFolder;
};

export type DraggableData = ProjectDraggableData | ProjectFolderDraggableData;

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

export type ProjectFolderPositionDroppableData = BaseDroppableData & {
  type: 'project-folder-position';
  folder: ProjectFolder;
  side: 'before' | 'after';
};

export type DroppableData =
  | ProjectPositionDroppableData
  | ProjectFolderDroppableData
  | ProjectFolderPositionDroppableData;

export type DraggableType = DraggableData['type'];
export type DroppableType = DroppableData['type'];
