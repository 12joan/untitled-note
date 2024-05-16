import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useDndContext } from '@dnd-kit/core';
import { useAppContext } from '~/lib/appContext';
import { describeProjectPosition } from '~/lib/dragAndDrop/projectsBar/accessibility';
import { ProjectPositionDropLine } from '~/lib/dragAndDrop/projectsBar/ProjectsBarDropLine';
import { useDroppableProjectFolder } from '~/lib/dragAndDrop/projectsBar/useDroppableProjectFolder';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { mapWithBeforeAndAfter } from '~/lib/mapWithBeforeAndAfter';
import { Project, ProjectFolder as TProjectFolder } from '~/lib/types';
import { Dropdown } from '~/components/Dropdown';
import { ProjectIcon } from '~/components/ProjectIcon';
import { ProjectListItem } from '~/components/ProjectListItem';
import { ProjectsBarActiveIndicator } from '~/components/ProjectsBarActiveIndicator';
import { TippyInstance } from '~/components/Tippy';

export interface ProjectFolderProps {
  folder: TProjectFolder;
  allProjects: Project[];
}

export const ProjectFolder = ({ folder, allProjects }: ProjectFolderProps) => {
  const currentProjectId = useAppContext('projectId');

  const projects = useMemo(
    () => allProjects.filter((project) => project.folder_id === folder.id),
    [allProjects, folder.id]
  );

  const containsCurrentProject = projects.some(
    (project) => project.id === currentProjectId
  );

  const tippyRef = useRef<TippyInstance>(null);

  const { setNodeRef, isDragOver, isDragOverOrInside } =
    useDroppableProjectFolder(folder);

  const isDraggingSomething = !!useDndContext().active;

  /**
   * Open the folder when the user drags a project over it, and close it again
   * if the dragged project is moved away. The `isDraggingSomething`
   * conditional prevents the folder from closing when the user drops the
   * project inside the folder or initiates a drag from within the folder.
   */
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
      {containsCurrentProject && <ProjectsBarActiveIndicator />}

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
          <ProjectFolderContent
            folder={folder}
            projects={projects}
            isVisible={isVisible}
          />
        }
      >
        <ProjectFolderTrigger
          ref={setNodeRef}
          folder={folder}
          projects={projects}
          isDragOver={isDragOver}
        />
      </Dropdown>
    </div>
  );
};

interface ProjectFolderTriggerProps {
  folder: TProjectFolder;
  projects: Project[];
  isDragOver: boolean;
}

const ProjectFolderTrigger = forwardRef<
  HTMLButtonElement,
  ProjectFolderTriggerProps
>(({ folder, projects, isDragOver }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={groupedClassNames({
        base: 'size-12 btn border border-dashed p-1.5 grid gap-1 grid-cols-2 border-plain-400 dark:border-plain-500',
        over: isDragOver && 'focus-ring ring-offset-2',
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
  );
});

interface ProjectFolderContentProps {
  folder: TProjectFolder;
  projects: Project[];
  isVisible: boolean;
}

const ProjectFolderContent = ({
  folder,
  projects,
  isVisible,
}: ProjectFolderContentProps) => {
  return (
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
                  description={describeProjectPosition(beforeProject, project)}
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
                  description={describeProjectPosition(project, afterProject)}
                />
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};
