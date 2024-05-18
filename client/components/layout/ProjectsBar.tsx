import React, { memo, MouseEvent, useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Portal } from '@headlessui/react';
import { updateProject as updateProjectAPI } from '~/lib/apis/project';
import { updateProjectFolder as updateProjectFolderAPI } from '~/lib/apis/projectFolder';
import { useAppContext } from '~/lib/appContext';
import {
  describeProjectFolderPosition,
  describeProjectPosition,
} from '~/lib/dragAndDrop/projectsBar/accessibility';
import {
  ProjectFolderPositionDropLine,
  ProjectPositionDropLine,
  ProjectsBarDropLine,
} from '~/lib/dragAndDrop/projectsBar/ProjectsBarDropLine';
import { useProjectsBarDnd } from '~/lib/dragAndDrop/projectsBar/useProjectsBarDnd';
import { findOrderStringBetween } from '~/lib/findOrderStringBetween';
import {
  handleUpdateProjectError,
  handleUpdateProjectFolderError,
} from '~/lib/handleErrors';
import { mapWithBeforeAndAfter } from '~/lib/mapWithBeforeAndAfter';
import {
  assertFuture,
  mapFuture,
  orDefaultFuture,
  resolvedFuture,
  unwrapFuture,
} from '~/lib/monads';
import { Project, ProjectFolder as TProjectFolder } from '~/lib/types';
import { useNewProject } from '~/lib/useNewProject';
import { useNewProjectFolder } from '~/lib/useNewProjectFolder';
import { useOverrideable } from '~/lib/useOverrideable';
import { Dropdown, DropdownItem } from '~/components/Dropdown';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import NewProjectFolderIcon from '~/components/icons/NewProjectFolderIcon';
import { Placeholder } from '~/components/Placeholder';
import {
  ProjectFolder,
  ProjectFolderTrigger,
} from '~/components/ProjectFolder';
import { ProjectIcon } from '~/components/ProjectIcon';
import { ProjectListItem } from '~/components/ProjectListItem';
import { ProjectsBarSubtleButton } from '~/components/ProjectsBarSubtleButton';

export interface ProjectsBarProps {
  onButtonClick?: (event: MouseEvent) => void;
}

export const ProjectsBar = memo(
  ({ onButtonClick = () => {} }: ProjectsBarProps) => {
    const projects = useAppContext('projects');
    const futureProjectFolders = useAppContext('futureProjectFolders');

    const { modal: newProjectModal, open: openNewProjectModal } =
      useNewProject();

    const { modal: newFolderModal, open: openNewFolderModal } =
      useNewProjectFolder();

    const [unsortedLocalProjects, setLocalProjects] = useOverrideable(projects);
    const [unsortedLocalFutureFolders, setLocalFutureFolders] =
      useOverrideable(futureProjectFolders);

    const localProjects = useMemo(
      () =>
        unsortedLocalProjects.sort((a, b) =>
          a.order_string < b.order_string ? -1 : 1
        ),
      [unsortedLocalProjects]
    );

    const localFutureFolders = useMemo(
      () =>
        mapFuture(unsortedLocalFutureFolders, (folders) =>
          folders.sort((a, b) => (a.order_string < b.order_string ? -1 : 1))
        ),
      [unsortedLocalFutureFolders]
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

    const updateProjectFolder = (
      folder: TProjectFolder,
      beforeFolder: TProjectFolder | null,
      afterFolder: TProjectFolder | null
    ) => {
      const delta = {
        order_string: findOrderStringBetween(
          beforeFolder?.order_string ?? null,
          afterFolder?.order_string ?? null
        ),
      };

      setLocalFutureFolders((localFutureFolders) => {
        const folders = assertFuture(localFutureFolders);
        const updatedFolder = { ...folder, ...delta };
        return resolvedFuture(
          folders.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
        );
      });

      handleUpdateProjectFolderError(
        updateProjectFolderAPI(folder.id, delta)
      ).catch((error) => {
        setLocalFutureFolders(futureProjectFolders);
        throw error;
      });
    };

    const unfolderedProjects = localProjects.filter(
      (project) => !project.folder_id
    );

    const { dndContextProps, draggingProject, draggingFolder } =
      useProjectsBarDnd({
        projects: localProjects,
        folders: orDefaultFuture(localFutureFolders, []),
        updateProject,
        updateProjectFolder,
      });

    return (
      <div className="p-3 flex flex-col gap-3">
        {newProjectModal}
        {newFolderModal}

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

                {draggingFolder && (
                  <div>
                    <ProjectFolderTrigger
                      folder={draggingFolder}
                      projects={localProjects.filter(
                        (project) => project.folder_id === draggingFolder.id
                      )}
                      className={{
                        btn: '',
                        rounded: 'rounded-lg',
                        dragOverlay:
                          'translate-x-1/3 translate-y-1/3 -rotate-12 opacity-75',
                      }}
                    />
                  </div>
                )}
              </DragOverlay>
            </div>
          </Portal>

          {mapWithBeforeAndAfter(
            unfolderedProjects,
            (project, beforeProject, afterProject, index) => (
              <div key={project.id}>
                <ProjectPositionDropLine
                  project={project}
                  side="before"
                  folder={null}
                  description={describeProjectPosition(beforeProject, project)}
                />

                <ProjectListItem
                  project={project}
                  testingListIndex={index}
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
                testId="empty-projects-drop-line"
              />
            </div>
          )}

          {unwrapFuture(localFutureFolders, {
            pending: (
              <>
                <Placeholder className="size-12 rounded-lg" />
                <Placeholder className="size-12 rounded-lg" />
                <Placeholder className="size-12 rounded-lg" />
              </>
            ),
            resolved: (folders) => (
              <>
                {mapWithBeforeAndAfter(
                  folders,
                  (folder, beforeFolder, afterFolder, index) => (
                    <div key={folder.id}>
                      <ProjectFolderPositionDropLine
                        folder={folder}
                        side="before"
                        description={describeProjectFolderPosition(
                          beforeFolder,
                          folder
                        )}
                      />

                      <ProjectFolder
                        folder={folder}
                        allProjects={localProjects}
                        updateProject={updateProject}
                        testingListIndex={index}
                      />

                      <ProjectFolderPositionDropLine
                        folder={folder}
                        side="after"
                        description={describeProjectFolderPosition(
                          folder,
                          afterFolder
                        )}
                      />
                    </div>
                  )
                )}
              </>
            ),
          })}

          <Dropdown
            items={
              <>
                <DropdownItem
                  icon={LargePlusIcon}
                  onClick={openNewProjectModal}
                >
                  New project
                </DropdownItem>
                <DropdownItem
                  icon={NewProjectFolderIcon}
                  onClick={openNewFolderModal}
                >
                  New folder
                </DropdownItem>
              </>
            }
            placement="right"
            autoMaxSize={false}
          >
            <ProjectsBarSubtleButton
              icon={LargePlusIcon}
              iconSize="2em"
              aria-label="New project or folder"
            />
          </Dropdown>
        </DndContext>
      </div>
    );
  }
);
