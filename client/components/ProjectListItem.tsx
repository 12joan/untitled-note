import React, {
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useRef,
  useState,
} from 'react';
import { useDndContext } from '@dnd-kit/core';
import { useAppContext } from '~/lib/appContext';
import { useDraggableProject } from '~/lib/dragAndDrop/projectsBar/useDraggableProject';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { mergeRefs } from '~/lib/refUtils';
import { OverviewLink, ProjectLink } from '~/lib/routes';
import { Project } from '~/lib/types';
import { ProjectIcon } from '~/components/ProjectIcon';
import { ProjectsBarActiveIndicator } from '~/components/ProjectsBarActiveIndicator';
import { TippyInstance } from '~/components/Tippy';
import { Tooltip } from '~/components/Tooltip';

export const projectListItemClassName = 'size-12 btn text-xl shadow';

export interface ProjectListItemProps {
  project: Project;
  inListType?: 'vertical' | 'grid';
  tabIndex?: number;
  disableTooltip?: boolean;
  testingListIndex?: number;
  onButtonClick?: (event: MouseEvent) => void;
}

export const ProjectListItem = ({
  project,
  inListType = 'vertical',
  tabIndex = 0,
  disableTooltip: disableTooltipProp = false,
  testingListIndex,
  onButtonClick,
}: ProjectListItemProps) => {
  const currentProjectId = useAppContext('projectId');
  const isCurrentProject = project.id === currentProjectId;

  const [tippyTriggerTarget, setTippyTriggerTarget] =
    useState<HTMLAnchorElement | null>(null);

  const tippyRef = useRef<TippyInstance>(null);
  const hideTooltip = () => tippyRef.current?.hide();

  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggableProject(project);

  // Keeping tooltips enabled during a drag can result in orphaned tooltips
  const isDraggingSomething = !!useDndContext().active;
  const disableTooltip = disableTooltipProp || isDraggingSomething;

  const withTooltip = (element: ReactElement) =>
    disableTooltip ? (
      element
    ) : (
      <Tooltip
        ref={tippyRef}
        content={project.name}
        placement={inListType === 'vertical' ? 'right' : 'bottom'}
        fixed
        triggerTarget={tippyTriggerTarget}
      >
        {element}
      </Tooltip>
    );

  return (
    <div
      className={groupedClassNames({
        base: 'flex gap-2',
        dragging: isDragging && 'opacity-50',
      })}
    >
      {inListType === 'vertical' && isCurrentProject && (
        <ProjectsBarActiveIndicator />
      )}

      {withTooltip(
        <ProjectIcon
          ref={mergeRefs([setNodeRef, setTippyTriggerTarget as any])}
          {...attributes}
          {...listeners}
          project={project}
          // Link props
          as={isCurrentProject ? OverviewLink : ProjectLink}
          to={{ projectId: project.id }}
          // HTML attributes
          className={groupedClassNames({
            base: projectListItemClassName,
            current:
              inListType === 'grid' &&
              isCurrentProject &&
              'focus-ring ring-offset-2 focus-visible:ring-4',
          })}
          style={{ cursor: 'pointer' }}
          onClick={(event: MouseEvent) => {
            hideTooltip();
            onButtonClick?.(event);
          }}
          onKeyDown={(event: KeyboardEvent) => {
            listeners?.onKeyDown(event);
            if (event.key === ' ') {
              hideTooltip();
            }
          }}
          aria-current={isCurrentProject ? 'page' : undefined}
          tabIndex={tabIndex}
          data-testid={`project-list-item-${project.name}`}
          data-test-list-index={testingListIndex}
        />
      )}
    </div>
  );
};
