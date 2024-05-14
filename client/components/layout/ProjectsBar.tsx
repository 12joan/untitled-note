import React, {
  KeyboardEvent,
  memo,
  MouseEvent,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Portal } from '@headlessui/react';
import { batchUpdateProjects } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { groupList } from '~/lib/groupList';
import { handleBatchUpdateProjectError } from '~/lib/handleErrors';
import { mergeRefs } from '~/lib/refUtils';
import { OverviewLink, ProjectLink } from '~/lib/routes';
import { setProjectArchivedAt } from '~/lib/transformProject';
import { Project } from '~/lib/types';
import { useNewProject } from '~/lib/useNewProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { Dropdown } from '~/components/Dropdown';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import { ProjectIcon } from '~/components/ProjectIcon';
import { TippyInstance, Tooltip } from '~/components/Tooltip';

type DraggableData = { type: 'project'; project: Project };

type DroppableData =
  | {
      type: 'project-position';
      projectId: number;
      side: 'before' | 'after';
      isArchived: boolean;
    }
  | {
      type: 'project-archived';
      isArchived: boolean;
    };

const getProjectDropLineId = (projectId: number, side: 'before' | 'after') =>
  `project-drop-line-${projectId}-${side}`;

export interface ProjectsBarProps {
  onButtonClick?: (event: MouseEvent) => void;
}

export const ProjectsBar = memo(
  ({ onButtonClick = () => {} }: ProjectsBarProps) => {
    const projects = useAppContext('projects');

    const { modal: newProjectModal, open: openNewProjectModal } =
      useNewProject();

    const [localProjects, setLocalProjects] = useOverrideable(projects);
    const [isDirty, setIsDirty] = useState(false);

    const { archivedProjects = [], unarchivedProjects = [] } = useMemo(
      () =>
        groupList(localProjects, (project) =>
          project.archived_at ? 'archivedProjects' : 'unarchivedProjects'
        ),
      [localProjects]
    );

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
      () => localProjects.find((p) => p.id === draggingId),
      [localProjects, draggingId]
    );

    // Update the order on the server when dragging ends
    useEffect(() => {
      if (draggingId || !isDirty) return;

      const batchUpdate: Parameters<typeof batchUpdateProjects>[0] =
        localProjects.map((project, index) => ({
          id: project.id,
          archived_at: project.archived_at,
          list_index: index,
        }));

      handleBatchUpdateProjectError(batchUpdateProjects(batchUpdate)).catch(
        () => setLocalProjects(projects)
      );

      setIsDirty(false);
    }, [draggingId, isDirty]);

    const handleDragStart = (event: DragStartEvent) => {
      setDraggingId(event.active.id as number);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      setDraggingId(null);
      if (!over) return;

      const moveProjectAndSetArchived = (
        project: Project,
        newIndex: number,
        isArchived: boolean
      ) => {
        const oldIndex = localProjects.findIndex((p) => p.id === project.id);

        /**
         * If the old index is before the new index, subtract 1 from the new
         * index to account for the old index being removed.
         */
        if (oldIndex < newIndex) {
          newIndex--;
        }

        const projectWithArchived: Project = {
          ...project,
          archived_at: setProjectArchivedAt(project.archived_at, isArchived),
        };

        const newProjects = arrayMove(projects, oldIndex, newIndex).map((p) =>
          p.id === project.id ? projectWithArchived : p
        );

        setLocalProjects(newProjects);
        setIsDirty(true);
      };

      const activeData = active.data.current as DraggableData;
      const overData = over.data.current as DroppableData;

      if (
        activeData.type === 'project' &&
        overData.type === 'project-position'
      ) {
        const { project } = activeData;
        const { projectId: overProjectId, side, isArchived } = overData;
        const newIndex =
          localProjects.findIndex((p) => p.id === overProjectId) +
          (side === 'after' ? 1 : 0);
        moveProjectAndSetArchived(project, newIndex, isArchived);
      }

      if (
        activeData.type === 'project' &&
        overData.type === 'project-archived'
      ) {
        const { project } = activeData;
        const { isArchived } = overData;
        const newIndex = localProjects.length;
        moveProjectAndSetArchived(project, newIndex, isArchived);
      }
    };

    return (
      <div className="p-3 flex flex-col gap-3">
        {newProjectModal}

        <DndContext
          // TODO: Configure https://docs.dndkit.com/guides/accessibility#screen-reader-instructions
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Portal>
            <div className="pointer-events-none">
              <DragOverlay>
                {draggingProject && (
                  <div>
                    <ProjectIcon
                      project={draggingProject}
                      className="size-12 text-xl shadow-lg rounded-lg translate-x-1/3 translate-y-1/3 -rotate-12 opacity-75"
                    />
                  </div>
                )}
              </DragOverlay>
            </div>
          </Portal>

          {unarchivedProjects.map((project) => (
            <div key={project.id}>
              <ProjectPositionDropLine projectId={project.id} side="before" />

              <ProjectListItem
                project={project}
                onButtonClick={onButtonClick}
              />

              <ProjectPositionDropLine projectId={project.id} side="after" />
            </div>
          ))}

          {unarchivedProjects.length === 0 && (
            <div className="-mt-3">
              <ProjectArchivedDropLine isArchived={false} side="after" />
            </div>
          )}

          {archivedProjects.length > 0 && (
            <PrototypeFolder projects={archivedProjects} />
          )}

          <Tooltip content="New project" placement="right" fixed>
            <button
              type="button"
              className="size-12 btn flex items-center justify-center p-1 text-plain-400 dark:text-plain-500 hocus:text-plain-500 hocus:dark:text-plain-400"
              onClick={openNewProjectModal}
              aria-label="New project"
            >
              <LargePlusIcon size="2em" noAriaLabel />
            </button>
          </Tooltip>
        </DndContext>
      </div>
    );
  }
);

interface DropLineProps {
  id: string;
  data: DroppableData;
  side?: 'before' | 'after';
  orientation?: 'vertical' | 'horizontal';
}

const DropLine = ({
  id,
  data,
  side,
  orientation = 'horizontal',
}: DropLineProps) => {
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

interface ProjectPositionDropLineProps
  extends Omit<DropLineProps, 'id' | 'data'> {
  projectId: number;
  side: 'before' | 'after';
  isArchived?: boolean;
}

const ProjectPositionDropLine = ({
  projectId,
  side,
  isArchived = false,
  ...props
}: ProjectPositionDropLineProps) => {
  return (
    <DropLine
      id={getProjectDropLineId(projectId, side)}
      data={{
        type: 'project-position',
        projectId,
        side,
        isArchived,
      }}
      side={side}
      {...props}
    />
  );
};

interface ProjectArchivedDropLineProps
  extends Omit<DropLineProps, 'id' | 'data'> {
  isArchived: boolean;
}

const ProjectArchivedDropLine = ({
  isArchived,
  ...props
}: ProjectArchivedDropLineProps) => {
  return (
    <DropLine
      id={`project-archived-drop-line-${
        isArchived ? 'archived' : 'unarchived'
      }`}
      data={{
        type: 'project-archived',
        isArchived,
      }}
      {...props}
    />
  );
};

interface ProjectListItemProps {
  project: Project;
  inListType?: 'vertical' | 'grid';
  tabIndex?: number;
  disableTooltip?: boolean;
  onButtonClick?: (event: MouseEvent) => void;
}

const ProjectListItem = ({
  project,
  inListType = 'vertical',
  tabIndex = 0,
  disableTooltip: disableTooltipProp = false,
  onButtonClick,
}: ProjectListItemProps) => {
  const currentProjectId = useAppContext('projectId');
  const isCurrentProject = project.id === currentProjectId;

  const [tippyTriggerTarget, setTippyTriggerTarget] =
    useState<HTMLAnchorElement | null>(null);

  const tippyRef = useRef<TippyInstance>(null);
  const hideTooltip = () => tippyRef.current?.hide();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: project.id,
    data: {
      type: 'project',
      project,
    } satisfies DraggableData,
  });

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
        <VerticalListActiveIndicator />
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
            base: 'size-12 btn text-xl shadow',
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
        />
      )}
    </div>
  );
};

const PrototypeFolder = ({ projects }: { projects: Project[] }) => {
  const projectId = useAppContext('projectId');
  const containsCurrentProject = projects.some(
    (project) => project.id === projectId
  );

  const { isOver, setNodeRef } = useDroppable({
    id: 'archived-folder',
    data: {
      type: 'project-archived',
      isArchived: true,
    } satisfies DroppableData,
  });

  const tippyRef = useRef<TippyInstance>(null);

  /**
   * Open the folder when the user drags a project over it, and close it again
   * if the dragged project is moved away. The `isDraggingSomething`
   * conditional prevents the folder from closing when the user drops the
   * project inside the folder or initiates a drag from within the folder.
   */
  const overData = useDndContext().over?.data.current as DroppableData | null;
  const isDragInside =
    overData?.type === 'project-position' && overData.isArchived;
  const isDragOverOrInside = isOver || isDragInside;
  const isDraggingSomething = !!useDndContext().active;

  useEffect(() => {
    if (isDraggingSomething) {
      if (isDragOverOrInside) {
        tippyRef.current?.show();
      } else {
        tippyRef.current?.hide();
      }
    }
  }, [isDragOverOrInside]);

  const [isVisible, setIsVisible] = useState(false);

  const colCount = Math.max(4, Math.ceil(Math.sqrt(projects.length)));
  const cellWidth = 12;
  const cellSpacing = 3;
  const totalWidth = colCount * cellWidth + (colCount - 1) * cellSpacing;
  const totalWidthRem = totalWidth / 4;

  return (
    <div className="flex gap-2">
      {containsCurrentProject && <VerticalListActiveIndicator />}

      <Dropdown
        tippyRef={tippyRef}
        trigger="mouseenter click"
        placement="right"
        className={{
          backgroundColor: 'bg-plain-100/75 dark:bg-plain-800/75',
          padding: 'p-4',
          border: 'border border-transparent dark:border-white/10',
          ringInset: null,
          ringOffset: 'ring-offset-plain-100 dark:ring-offset-plain-800',
        }}
        onShow={() => setIsVisible(true)}
        onHide={() => setIsVisible(false)}
        items={
          // TODO: Max width
          <div style={{ width: `${totalWidthRem}rem` }}>
            <h1 className="h3 mb-3">Archived projects</h1>

            <div className="flex flex-wrap gap-3">
              {projects.map((project) => {
                return (
                  <div className="flex" key={project.id}>
                    {isVisible && (
                      <ProjectPositionDropLine
                        projectId={project.id}
                        side="before"
                        isArchived
                        orientation="vertical"
                      />
                    )}

                    <ProjectListItem
                      project={project}
                      inListType="grid"
                      disableTooltip={!isVisible}
                    />

                    {isVisible && (
                      <ProjectPositionDropLine
                        projectId={project.id}
                        side="after"
                        isArchived
                        orientation="vertical"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        }
      >
        <button
          ref={setNodeRef}
          type="button"
          className={groupedClassNames({
            base: 'size-12 btn border border-dashed p-1.5 grid gap-1 grid-cols-2 border-plain-400 dark:border-plain-500',
            over: isOver && 'focus-ring ring-offset-2',
          })}
        >
          {projects.slice(0, 4).map((project) => (
            <ProjectIcon
              key={project.id}
              project={project}
              className="aspect-square rounded shadow-sm"
              textScale={0.5}
              aria-hidden="true"
            />
          ))}
        </button>
      </Dropdown>
    </div>
  );
};

const VerticalListActiveIndicator = () => {
  return (
    <div className="-ml-4 my-2 w-2 h-8 rounded-full bg-primary-500 dark:bg-primary-400 window-inactive:bg-plain-500 dark:window-inactive:bg-plain-400" />
  );
};
