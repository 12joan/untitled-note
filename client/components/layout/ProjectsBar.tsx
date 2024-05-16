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
  Active,
  Announcements,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  Over,
  PointerSensor,
  useDndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Portal } from '@headlessui/react';
import { updateProject as updateProjectAPI } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { findOrderStringBetween } from '~/lib/findOrderStringBetween';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { handleUpdateProjectError } from '~/lib/handleErrors';
import { unwrapFuture } from '~/lib/monads';
import { mergeRefs } from '~/lib/refUtils';
import { OverviewLink, ProjectLink } from '~/lib/routes';
import { Project, type ProjectFolder } from '~/lib/types';
import { useNewProject } from '~/lib/useNewProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { Dropdown } from '~/components/Dropdown';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import { Placeholder } from '~/components/Placeholder';
import { ProjectIcon } from '~/components/ProjectIcon';
import { TippyInstance, Tooltip } from '~/components/Tooltip';

type DraggableData = {
  type: 'project';
  project: Project;
  description: string;
};

type DroppableData =
  | {
      type: 'project-position';
      project: Project;
      side: 'before' | 'after';
      folder: ProjectFolder | null;
      description: string;
    }
  | {
      type: 'project-folder';
      folder: ProjectFolder | null;
      description: string;
    };

const getDraggableData = <T extends Active | undefined | null>(
  active: T
): T extends Active ? DraggableData : DraggableData | null => {
  if (!active) return null as any;
  return active.data.current as any;
};

const getDroppableData = <T extends Over | undefined | null>(
  over: T
): T extends Over ? DroppableData : DroppableData | null => {
  if (!over) return null as any;
  return over.data.current as any;
};

const mapWithBeforeAndAfter = <T, U>(
  items: T[],
  fn: (item: T, before: T | null, after: T | null) => U
): U[] => {
  return items.map((item, i) => {
    const before = i > 0 ? items[i - 1] : null;
    const after = i < items.length - 1 ? items[i + 1] : null;
    return fn(item, before, after);
  });
};

const describeProject = ({ name }: Project) => `project "${name}"`;
// const describeProjectFolder = ({ name }: ProjectFolder) => `folder "${name}"`;

const describeProjectPosition = (
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

const announcements: Announcements = {
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

export interface ProjectsBarProps {
  onButtonClick?: (event: MouseEvent) => void;
}

export const ProjectsBar = memo(
  ({ onButtonClick = () => {} }: ProjectsBarProps) => {
    const projects = useAppContext('projects');
    const futureProjectFolders = useAppContext('futureProjectFolders');

    const { modal: newProjectModal, open: openNewProjectModal } =
      useNewProject();

    const [unsortedLocalProjects, setLocalProjects] = useOverrideable(projects);

    const localProjects = useMemo(
      () =>
        unsortedLocalProjects.sort((a, b) =>
          a.order_string < b.order_string ? -1 : 1
        ),
      [unsortedLocalProjects]
    );

    const updateProject = (
      project: Project,
      folder: ProjectFolder | null,
      beforeProject: Project | null,
      afterProject: Project | null
    ) => {
      const delta = {
        folder_id: folder ? folder.id : null,
        order_string: findOrderStringBetween(
          beforeProject?.order_string ?? null,
          afterProject?.order_string ?? null
        ),
      };

      setLocalProjects((projects) => {
        const updatedProject = { ...project, ...delta };
        return projects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        );
      });

      handleUpdateProjectError(updateProjectAPI(project.id, delta)).catch(
        (error) => {
          setLocalProjects(projects);
          throw error;
        }
      );
    };

    const unfolderedProjects = localProjects.filter(
      (project) => !project.folder_id
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

    const handleDragStart = (event: DragStartEvent) => {
      setDraggingId(event.active.id as number);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
      setDraggingId(null);
      if (!over) return;

      const activeData = getDraggableData(active);
      const overData = getDroppableData(over);

      if (
        activeData.type === 'project' &&
        overData.type === 'project-position'
      ) {
        const { project: activeProject } = activeData;
        const { project, side, folder } = overData;
        const referenceProjectIndex = localProjects.findIndex(
          (p) => p.id === project.id
        );
        const offset = side === 'before' ? -1 : 1;
        const otherProjectIndex = referenceProjectIndex + offset;
        const otherProject = localProjects[otherProjectIndex] ?? null;
        const beforeProject = side === 'before' ? otherProject : project;
        const afterProject = side === 'after' ? otherProject : project;
        updateProject(activeProject, folder, beforeProject, afterProject);
      }

      if (activeData.type === 'project' && overData.type === 'project-folder') {
        const { project } = activeData;
        const { folder } = overData;
        const beforeProject = localProjects[localProjects.length - 1];
        updateProject(project, folder, beforeProject, null);
      }
    };

    return (
      <div className="p-3 flex flex-col gap-3">
        {newProjectModal}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          accessibility={{
            screenReaderInstructions: {
              draggable:
                'To pick up a project, press the space bar. While dragging, use the arrow keys to move the project to its new position or over a folder. Press space again to drop the project in its new position, or press escape to cancel.',
            },
            announcements,
          }}
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

          {mapWithBeforeAndAfter(
            unfolderedProjects,
            (project, beforeProject, afterProject) => (
              <div key={project.id}>
                <ProjectPositionDropLine
                  project={project}
                  side="before"
                  folder={null}
                  description={describeProjectPosition(beforeProject, project)}
                />

                <ProjectListItem
                  project={project}
                  onButtonClick={onButtonClick}
                />

                <ProjectPositionDropLine
                  project={project}
                  side="after"
                  folder={null}
                  description={describeProjectPosition(project, afterProject)}
                />
              </div>
            )
          )}

          {unfolderedProjects.length === 0 && (
            <div className="-mt-3">
              <DropLine
                id="empty-projects-drop-line"
                side="after"
                data={{
                  type: 'project-folder',
                  folder: null,
                  description: 'onto the list of projects',
                }}
              />
            </div>
          )}

          {unwrapFuture(futureProjectFolders, {
            pending: (
              <>
                <Placeholder className="size-12 rounded-lg" />
                <Placeholder className="size-12 rounded-lg" />
                <Placeholder className="size-12 rounded-lg" />
              </>
            ),
            resolved: (folders) => (
              <>
                {folders.map((folder) => (
                  <ProjectFolder
                    key={folder.id}
                    folder={folder}
                    allProjects={localProjects}
                  />
                ))}
              </>
            ),
          })}

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
  project: Project;
  side: 'before' | 'after';
  folder: ProjectFolder | null;
  description: string;
}

const ProjectPositionDropLine = ({
  project,
  side,
  folder,
  description,
  ...props
}: ProjectPositionDropLineProps) => {
  return (
    <DropLine
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
    attributes: {
      role: 'link',
      roleDescription: 'sortable project',
    },
    data: {
      type: 'project',
      project,
      description: describeProject(project),
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

interface ProjectFolderProps {
  folder: ProjectFolder;
  allProjects: Project[];
}

const ProjectFolder = ({ folder, allProjects }: ProjectFolderProps) => {
  const currentProjectId = useAppContext('projectId');

  const projects = useMemo(
    () => allProjects.filter((project) => project.folder_id === folder.id),
    [allProjects, folder.id]
  );

  const containsCurrentProject = projects.some(
    (project) => project.id === currentProjectId
  );

  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: 'project-folder',
      folder,
      description: `onto ${folder.name}`,
    } satisfies DroppableData,
  });

  const tippyRef = useRef<TippyInstance>(null);

  /**
   * Open the folder when the user drags a project over it, and close it again
   * if the dragged project is moved away. The `isDraggingSomething`
   * conditional prevents the folder from closing when the user drops the
   * project inside the folder or initiates a drag from within the folder.
   */
  const overData = getDroppableData(useDndContext().over);
  const isDragInside =
    overData?.type === 'project-position' && overData.folder === folder;
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
  const padding = 4;
  const totalWidth =
    colCount * cellWidth + (colCount - 1) * cellSpacing + 2 * padding;
  const totalWidthRem = totalWidth / 4;
  const borderPixels = 2;
  const width = `calc(${totalWidthRem}rem + ${borderPixels}px)`;

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
        style={{ width }}
        onShow={() => setIsVisible(true)}
        onHide={() => setIsVisible(false)}
        items={
          <>
            <h1 className="h3 mb-3">{folder.name}</h1>

            <div className="flex flex-wrap gap-3">
              {mapWithBeforeAndAfter(
                projects,
                (project, beforeProject, afterProject) => (
                  <div className="flex" key={project.id}>
                    {isVisible && (
                      <ProjectPositionDropLine
                        project={project}
                        side="before"
                        folder={folder}
                        orientation="vertical"
                        description={describeProjectPosition(
                          beforeProject,
                          project
                        )}
                      />
                    )}

                    <ProjectListItem
                      project={project}
                      inListType="grid"
                      disableTooltip={!isVisible}
                    />

                    {isVisible && (
                      <ProjectPositionDropLine
                        project={project}
                        side="after"
                        folder={folder}
                        orientation="vertical"
                        description={describeProjectPosition(
                          project,
                          afterProject
                        )}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </>
        }
      >
        <button
          ref={setNodeRef}
          type="button"
          className={groupedClassNames({
            base: 'size-12 btn border border-dashed p-1.5 grid gap-1 grid-cols-2 border-plain-400 dark:border-plain-500',
            over: isOver && 'focus-ring ring-offset-2',
          })}
          aria-label={folder.name}
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
