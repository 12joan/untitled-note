import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Project, ProjectFolder } from '~/lib/types';
import { DroppableData } from '../types';

export interface ProjectsBarDropLineProps {
  id: string;
  data: DroppableData;
  side?: 'before' | 'after';
  orientation?: 'vertical' | 'horizontal';
}

export const ProjectsBarDropLine = ({
  id,
  data,
  side,
  orientation = 'horizontal',
}: ProjectsBarDropLineProps) => {
  const { isOver, setNodeRef } = useDroppable({ id, data });

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        className={groupedClassNames({
          base: 'absolute rounded-full',
          orientation:
            orientation === 'horizontal'
              ? 'h-0.5 w-12 -translate-y-1/2'
              : 'w-0.5 h-12 -translate-x-1/2',
          over: isOver && 'bg-primary-500 dark:bg-primary-400',
        })}
        style={{
          [orientation === 'horizontal' ? 'top' : 'left']: {
            before: '-0.375rem',
            after: '0.375rem',
            center: '',
          }[side ?? 'center'],
        }}
      />
    </div>
  );
};

export interface ProjectPositionDropLineProps
  extends Omit<ProjectsBarDropLineProps, 'id' | 'data'> {
  project: Project;
  side: 'before' | 'after';
  folder: ProjectFolder | null;
  description: string;
}

export const ProjectPositionDropLine = ({
  project,
  side,
  folder,
  description,
  ...props
}: ProjectPositionDropLineProps) => {
  return (
    <ProjectsBarDropLine
      id={`project-drop-line-${project.id}-${side}`}
      data={{
        type: 'project-position',
        project,
        side,
        folder,
        description,
      }}
      side={side}
      {...props}
    />
  );
};
