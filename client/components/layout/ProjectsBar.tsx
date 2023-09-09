import React, {
  ButtonHTMLAttributes,
  KeyboardEvent,
  memo,
  MouseEvent,
  ReactElement,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { updateProjectOrder } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { groupList } from '~/lib/groupList';
import { handleReorderProjectsError } from '~/lib/handleErrors';
import { OverviewLink, ProjectLink } from '~/lib/routes';
import { Project } from '~/lib/types';
import { useCSPNonce } from '~/lib/useCSPNonce';
import { useElementSize } from '~/lib/useElementSize';
import { useNewProject } from '~/lib/useNewProject';
import { useOverrideable } from '~/lib/useOverrideable';
import ChevronUpIcon from '~/components/icons/ChevronUpIcon';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import { ProjectIcon } from '~/components/ProjectIcon';
import { TippyInstance, Tooltip } from '~/components/Tooltip';

export interface ProjectsBarProps {
  onButtonClick?: (event: MouseEvent) => void;
}

export const ProjectsBar = memo(
  ({ onButtonClick = () => {} }: ProjectsBarProps) => {
    const projectId = useAppContext('projectId');
    const projects = useAppContext('projects');

    const { modal: newProjectModal, open: openNewProjectModal } =
      useNewProject();

    const [localProjects, setLocalProjects] = useOverrideable(projects);

    const { archivedProjects = [], unarchivedProjects = [] } = useMemo(
      () =>
        groupList(localProjects, (project) =>
          project.archived_at ? 'archivedProjects' : 'unarchivedProjects'
        ),
      [localProjects]
    );

    const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
      if (!destination) return;

      const newProjects = [...unarchivedProjects, ...archivedProjects];
      const [removed] = newProjects.splice(source.index, 1);
      newProjects.splice(destination.index, 0, removed);
      setLocalProjects(newProjects);

      handleReorderProjectsError(
        updateProjectOrder(newProjects.map(({ id }) => id))
      ).catch(() => setLocalProjects(localProjects));
    };

    const nonce = useCSPNonce();

    return (
      <>
        {newProjectModal}

        <DragDropContext onDragEnd={handleDragEnd} nonce={nonce}>
          <Droppable droppableId="projects" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-3"
              >
                {unarchivedProjects.map((project, index) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    index={index}
                    draggable
                    onButtonClick={onButtonClick}
                  />
                ))}

                {provided.placeholder}

                {archivedProjects.length > 0 && (
                  <ProjectFolder
                    name="Archived projects"
                    projects={archivedProjects}
                    initialExpanded={archivedProjects.some(
                      ({ id }) => id === projectId
                    )}
                    onButtonClick={onButtonClick}
                  />
                )}

                <Tooltip content="New project" placement="right" fixed>
                  <button
                    type="button"
                    className="w-12 btn aspect-square flex items-center justify-center p-1 text-slate-400 dark:text-slate-500 hocus:text-slate-500 hocus:dark:text-slate-400"
                    onClick={openNewProjectModal}
                  >
                    <LargePlusIcon size="2em" ariaLabel="New project" />
                  </button>
                </Tooltip>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
);

interface ProjectFolderProps {
  name: string;
  projects: Project[];
  initialExpanded?: boolean;
  onButtonClick: (event: MouseEvent) => void;
}

const ProjectFolder = ({
  name,
  projects,
  initialExpanded = false,
  onButtonClick,
}: ProjectFolderProps) => {
  const [isExpanded, setIsExpanded] = useOverrideable(initialExpanded);
  const id = useId();

  const [{ height: collapsibleHeight }, collapsibleRef] = useElementSize();

  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    onClick: () => setIsExpanded(!isExpanded),
    'aria-controls': id,
    'aria-expanded': isExpanded,
    'aria-label': `${isExpanded ? 'Collapse' : 'Expand'} ${name}`,
  };

  return (
    <div className="mb-3">
      <div
        className={`-m-1 rounded-xl p-1 ${
          isExpanded ? 'bg-slate-200 dark:bg-black/75' : ''
        }`}
      >
        <div className="-mb-3">
          <div className="mb-3">
            <Tooltip content="Archived projects" placement="right" fixed>
              {isExpanded ? (
                <button
                  type="button"
                  className="btn w-12 h-12 flex justify-center items-center text-slate-400 dark:text-slate-500"
                  {...buttonProps}
                >
                  <ChevronUpIcon size="2em" noAriaLabel />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn w-12 h-12 border border-dashed p-1.5 grid gap-1 grid-cols-2 border-slate-400 dark:border-slate-500"
                  {...buttonProps}
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
              )}
            </Tooltip>
          </div>

          <div
            id={id}
            className="transition-[max-height,opacity]"
            style={{
              overflow: isExpanded ? undefined : 'hidden',
              maxHeight: isExpanded ? collapsibleHeight : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            aria-hidden={!isExpanded}
          >
            <div ref={collapsibleRef}>
              {projects.map((project, index) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  index={index}
                  onButtonClick={onButtonClick}
                  tabIndex={isExpanded ? 0 : -1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectListItemProps {
  project: Project;
  index: number;
  draggable?: boolean;
  onButtonClick: (event: MouseEvent) => void;
  tabIndex?: number;
}

const ProjectListItem = ({
  project,
  index,
  draggable = false,
  onButtonClick,
  tabIndex = 0,
}: ProjectListItemProps) => {
  const currentProjectId = useAppContext('projectId');
  const isCurrentProject = project.id === currentProjectId;

  const [tippyTriggerTarget, setTippyTriggerTarget] =
    useState<HTMLAnchorElement | null>(null);

  const tippyRef = useRef<TippyInstance>(null);
  const hideTooltip = () => tippyRef.current?.hide();

  const withDraggable = (
    renderFunc: (props: {
      containerProps: Record<string, any>;
      handleProps: Record<string, any>;
    }) => ReactElement
  ) => {
    if (draggable) {
      return (
        <Draggable draggableId={project.id.toString()} index={index}>
          {(provided) =>
            renderFunc({
              containerProps: {
                ref: provided.innerRef,
                ...(provided.draggableProps || {}),
              },
              handleProps: provided.dragHandleProps || {},
            })
          }
        </Draggable>
      );
    }

    return renderFunc({
      containerProps: {},
      handleProps: {},
    });
  };

  return withDraggable(({ containerProps, handleProps }) => {
    return (
      <Tooltip
        ref={tippyRef}
        content={project.name}
        placement="right"
        fixed
        triggerTarget={tippyTriggerTarget}
      >
        <div {...containerProps} className="flex gap-2 -ml-3 mb-3">
          <div
            aria-hidden="true"
            className="opacity-0 data-active:opacity-100 -ml-1 my-2 w-2 h-8 rounded-full bg-primary-500 dark:bg-primary-400 window-inactive:bg-slate-500 dark:window-inactive:bg-slate-400"
            data-active={isCurrentProject}
          />

          <ProjectIcon
            ref={setTippyTriggerTarget}
            project={project}
            {...handleProps}
            // Link props
            as={isCurrentProject ? OverviewLink : ProjectLink}
            to={{ projectId: project.id }}
            // HTML attributes
            className="w-12 h-12 btn text-xl shadow"
            style={{ cursor: 'pointer' }}
            onClick={(event: MouseEvent) => {
              hideTooltip();
              onButtonClick(event);
            }}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === ' ') {
                hideTooltip();
              }
            }}
            aria-current={isCurrentProject ? 'page' : undefined}
            tabIndex={tabIndex}
          />
        </div>
      </Tooltip>
    );
  });
};
