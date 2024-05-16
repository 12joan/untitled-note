import React, { memo, MouseEvent, useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Portal } from '@headlessui/react';
import { updateProject as updateProjectAPI } from '~/lib/apis/project';
import { useAppContext } from '~/lib/appContext';
import { describeProjectPosition } from '~/lib/dragAndDrop/projectsBar/accessibility';
import {
  ProjectPositionDropLine,
  ProjectsBarDropLine,
} from '~/lib/dragAndDrop/projectsBar/ProjectsBarDropLine';
import { useProjectsBarDnd } from '~/lib/dragAndDrop/projectsBar/useProjectsBarDnd';
import { findOrderStringBetween } from '~/lib/findOrderStringBetween';
import { handleUpdateProjectError } from '~/lib/handleErrors';
import { mapWithBeforeAndAfter } from '~/lib/mapWithBeforeAndAfter';
import { unwrapFuture } from '~/lib/monads';
import { Project, ProjectFolder as TProjectFolder } from '~/lib/types';
import { useNewProject } from '~/lib/useNewProject';
import { useOverrideable } from '~/lib/useOverrideable';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import { Placeholder } from '~/components/Placeholder';
import { ProjectFolder } from '~/components/ProjectFolder';
import { ProjectIcon } from '~/components/ProjectIcon';
import { Tooltip } from '~/components/Tooltip';
import { ProjectListItem } from '../ProjectListItem';

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
      folder: TProjectFolder | null,
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

    const { dndContextProps, draggingProject } = useProjectsBarDnd({
      projects: localProjects,
      updateProject,
    });

    return (
      <div className="p-3 flex flex-col gap-3">
        {newProjectModal}

        <DndContext {...dndContextProps}>
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
              <ProjectsBarDropLine
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
