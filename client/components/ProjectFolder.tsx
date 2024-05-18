import React, {
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDndContext } from '@dnd-kit/core';
import { deleteProjectFolder as deleteProjectFolderAPI } from '~/lib/apis/projectFolder';
import { useAppContext } from '~/lib/appContext';
import { describeProjectPosition } from '~/lib/dragAndDrop/projectsBar/accessibility';
import { ProjectPositionDropLine } from '~/lib/dragAndDrop/projectsBar/ProjectsBarDropLine';
import { useDraggableProjectFolder } from '~/lib/dragAndDrop/projectsBar/useDraggableProjectFolder';
import { useDroppableProjectFolder } from '~/lib/dragAndDrop/projectsBar/useDroppableProjectFolder';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
import { handleDeleteProjectFolderError } from '~/lib/handleErrors';
import { mapWithBeforeAndAfter } from '~/lib/mapWithBeforeAndAfter';
import { mergeRefs } from '~/lib/refUtils';
import { Project, ProjectFolder as TProjectFolder } from '~/lib/types';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import { useNewProject } from '~/lib/useNewProject';
import { useRenameProjectFolder } from '~/lib/useRenameProjectFolder';
import { Dropdown, DropdownItem } from '~/components/Dropdown';
import AddExistingProjectIcon from '~/components/icons/AddExistingProjectIcon';
import ChevronLeftIcon from '~/components/icons/ChevronLeftIcon';
import DeleteIcon from '~/components/icons/DeleteIcon';
import EditIcon from '~/components/icons/EditIcon';
import LargePlusIcon from '~/components/icons/LargePlusIcon';
import { IconProps } from '~/components/icons/makeIcon';
import MinusIcon from '~/components/icons/MinusIcon';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import PlusIcon from '~/components/icons/PlusIcon';
import RemoveProjectIcon from '~/components/icons/RemoveProjectIcon';
import { ProjectIcon } from '~/components/ProjectIcon';
import {
  ProjectListItem,
  projectListItemClassName,
} from '~/components/ProjectListItem';
import { ProjectsBarActiveIndicator } from '~/components/ProjectsBarActiveIndicator';
import { ProjectsBarSubtleButton } from '~/components/ProjectsBarSubtleButton';
import { TippyInstance } from '~/components/Tippy';
import { Tooltip } from '~/components/Tooltip';
import { WithCloseButton } from '~/components/WithCloseButton';

export interface ProjectFolderProps {
  folder: TProjectFolder;
  allProjects: Project[];
  updateProject: (
    project: Project,
    folder: TProjectFolder | null,
    beforeProject: Project | null,
    afterProject: Project | null
  ) => void;
  testingListIndex?: number;
}

export const ProjectFolder = ({
  folder,
  allProjects,
  updateProject,
  testingListIndex,
}: ProjectFolderProps) => {
  const currentProjectId = useAppContext('projectId');

  const projects = useMemo(
    () => allProjects.filter((project) => project.folder_id === folder.id),
    [allProjects, folder.id]
  );

  const containsCurrentProject = projects.some(
    (project) => project.id === currentProjectId
  );

  const tippyRef = useRef<TippyInstance>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const focusDropdown = () => dropdownRef.current?.focus();

  const {
    setNodeRef: droppableRef,
    isDragOver,
    isDragOverOrInside,
  } = useDroppableProjectFolder(folder);

  const {
    attributes,
    listeners,
    setNodeRef: draggableRef,
    isDragging,
  } = useDraggableProjectFolder(folder);

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

  /**
   * Prevent the folder from closing when a change to its width or height
   * causes the cursor to leave the folder.
   */
  const keepOpen = () => {
    tippyRef.current?.hide();
    tippyRef.current?.show();
  };

  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex gap-2">
      {containsCurrentProject && <ProjectsBarActiveIndicator />}

      <Dropdown
        ref={dropdownRef}
        tippyRef={tippyRef}
        trigger="mouseenter click"
        placement="right"
        className={{
          backgroundColor: 'bg-plain-100/75 dark:bg-plain-850/75',
          border: 'border border-transparent dark:border-white/10',
          ringInset: null,
          ringOffset: 'ring-offset-plain-100 dark:ring-offset-plain-800',
        }}
        autoMaxSize={false}
        onShow={() => setIsVisible(true)}
        onHide={() => setIsVisible(false)}
        items={
          <ProjectFolderContent
            folder={folder}
            projects={projects}
            allProjects={allProjects}
            updateProject={updateProject}
            isVisible={isVisible}
            keepOpen={keepOpen}
            focusDropdown={focusDropdown}
          />
        }
      >
        <ProjectFolderTrigger
          ref={mergeRefs([droppableRef, draggableRef]) as any}
          folder={folder}
          projects={projects}
          isDragOver={isDragOver}
          isDragging={isDragging}
          {...attributes}
          {...listeners}
          data-test-list-index={testingListIndex}
        />
      </Dropdown>
    </div>
  );
};

export interface ProjectFolderTriggerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'className'> {
  folder: TProjectFolder;
  projects: Project[];
  isDragOver?: boolean;
  isDragging?: boolean;
  className?: GroupedClassNames;
}

export const ProjectFolderTrigger = forwardRef<
  HTMLButtonElement,
  ProjectFolderTriggerProps
>(
  (
    {
      folder,
      projects,
      isDragOver = false,
      isDragging = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={groupedClassNames(
          {
            size: 'size-12',
            btn: 'btn',
            border:
              'border border-dashed border-plain-400 dark:border-plain-500',
            padding: 'p-1.5',
            grid: 'grid gap-1 grid-cols-2',
            over: isDragOver && 'focus-ring ring-offset-2',
            dragging: isDragging && 'opacity-50',
          },
          className
        )}
        aria-label={folder.name}
        data-testid={`project-folder-${folder.name}`}
        {...props}
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
  }
);

interface ProjectFolderContentProps {
  folder: TProjectFolder;
  projects: Project[];
  allProjects: Project[];
  updateProject: ProjectFolderProps['updateProject'];
  isVisible: boolean;
  keepOpen: () => void;
  focusDropdown: () => void;
}

const ProjectFolderContent = ({
  folder,
  projects,
  allProjects,
  updateProject,
  isVisible,
  keepOpen,
  focusDropdown,
}: ProjectFolderContentProps) => {
  const [view, rawSetView] = useState<'default' | 'menu' | 'add' | 'remove'>(
    'default'
  );

  const setView: typeof rawSetView = (arg) => {
    keepOpen();
    rawSetView(arg);
    focusDropdown();
  };

  useEffectAfterFirst(() => {
    if (!isVisible) {
      rawSetView('default');
    }
  }, [isVisible]);

  const lastOfAllProjects = allProjects[allProjects.length - 1];

  const unfolderedProjects = allProjects.filter(
    (project) => project.folder_id === null
  );

  const { modal: newProjectModal, open: openNewProjectModal } = useNewProject({
    folder,
  });

  const { modal: renameFolderModal, open: openRenameFolderModal } =
    useRenameProjectFolder(folder);

  const deleteFolder = () =>
    handleDeleteProjectFolderError(deleteProjectFolderAPI(folder.id));

  const addProject = (project: Project) => {
    keepOpen();
    updateProject(project, folder, lastOfAllProjects, null);
  };

  const removeProject = (project: Project) => {
    keepOpen();
    updateProject(project, null, lastOfAllProjects, null);
  };

  let content: ReactNode;

  if (view === 'menu') {
    content = (
      <div className="[&_*]:ring-inset">
        {newProjectModal}

        <DropdownItem icon={ChevronLeftIcon} onClick={() => setView('default')}>
          Back
        </DropdownItem>

        <DropdownItem
          icon={LargePlusIcon}
          onClick={() => setTimeout(openNewProjectModal)}
        >
          New project
        </DropdownItem>

        <DropdownItem
          icon={AddExistingProjectIcon}
          onClick={() => setView('add')}
        >
          Add projects
        </DropdownItem>

        <DropdownItem
          icon={RemoveProjectIcon}
          onClick={() => setView('remove')}
        >
          Remove projects
        </DropdownItem>

        <DropdownItem
          icon={EditIcon}
          onClick={() => setTimeout(openRenameFolderModal)}
        >
          Rename folder
        </DropdownItem>

        <DropdownItem icon={DeleteIcon} onClick={deleteFolder} variant="danger">
          Delete folder
        </DropdownItem>
      </div>
    );
  }

  if (view === 'add') {
    content = (
      <GridView
        label="Add projects"
        items={unfolderedProjects}
        renderItem={(project) => (
          <ProjectButton
            key={project.id}
            project={project}
            aria-label={`Add ${project.name} to folder`}
            cornerIcon={PlusIcon}
            onClick={() => addProject(project)}
          />
        )}
        renderWhenEmpty={<p>No projects to add</p>}
        onCloseButton={() => setView('default')}
      />
    );
  }

  if (view === 'remove') {
    content = (
      <GridView
        label="Remove projects"
        items={projects}
        renderItem={(project) => (
          <ProjectButton
            key={project.id}
            project={project}
            cornerIcon={MinusIcon}
            aria-label={`Remove ${project.name} from folder`}
            onClick={() => removeProject(project)}
          />
        )}
        renderWhenEmpty={<p>No projects to remove</p>}
        onCloseButton={() => setView('default')}
      />
    );
  }

  const contentWithDefault = content ?? (
    <GridView
      label={folder.name}
      items={projects}
      renderItem={(project, beforeProject, afterProject, index) => (
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
            testingListIndex={index}
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
      )}
      renderAfter={
        projects.length === 0
          ? []
          : [
              <ProjectsBarSubtleButton
                key="folder-menu"
                icon={OverflowMenuIcon}
                aria-label="Folder actions"
                onClick={() => setView('menu')}
              />,
            ]
      }
      renderWhenEmpty={
        <button
          type="button"
          className="btn btn-rect btn-modal-secondary text-sm w-full"
          onClick={() => setView('menu')}
        >
          Folder actions
        </button>
      }
    />
  );

  return (
    <>
      {newProjectModal}
      {renameFolderModal}
      {contentWithDefault}
    </>
  );
};

interface GridView<T> {
  label: string;
  items: T[];
  renderItem: (
    item: T,
    beforeItem: T | null,
    afterItem: T | null,
    index: number
  ) => ReactNode;
  renderAfter?: ReactNode[];
  renderWhenEmpty?: ReactNode;
  onCloseButton?: () => void;
}

const GridView = <T,>({
  label,
  items,
  renderItem,
  renderAfter = [],
  renderWhenEmpty,
  onCloseButton,
}: GridView<T>) => {
  const width = useMemo(() => {
    const colCount = Math.max(
      4,
      Math.ceil(Math.sqrt(items.length + renderAfter.length))
    );
    const cellWidth = 12;
    const cellSpacing = 3;
    const padding = 4;
    const totalWidth =
      colCount * cellWidth + (colCount - 1) * cellSpacing + 2 * padding;
    const totalWidthRem = totalWidth / 4;
    const borderPixels = 2;
    return `calc(${totalWidthRem}rem + ${borderPixels}px)`;
  }, [items.length, renderAfter.length]);

  const labelElement = <h1 className="h3">{label}</h1>;

  return (
    <div className="p-4 space-y-3" style={{ width }}>
      {onCloseButton ? (
        <WithCloseButton
          buttonClassName={{
            padding: 'p-1.5',
            fontSize: 'text-xs',
          }}
          aria-label="Done"
          onClose={onCloseButton}
        >
          {labelElement}
        </WithCloseButton>
      ) : (
        labelElement
      )}

      {items.length === 0 && renderWhenEmpty}

      {(items.length > 0 || renderAfter.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {mapWithBeforeAndAfter(items, renderItem)}
          {renderAfter}
        </div>
      )}
    </div>
  );
};

interface ProjectButtonProps {
  project: Project;
  cornerIcon?: ElementType<IconProps>;
  onClick: () => void;
  'aria-label': string;
}

const ProjectButton = ({
  project,
  cornerIcon: CornerIcon,
  onClick,
  'aria-label': ariaLabel,
}: ProjectButtonProps) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Tooltip content={project.name} placement="bottom">
        <ProjectIcon
          as="button"
          type="button"
          project={project}
          className={projectListItemClassName}
          style={{
            // Prevent focus style from layering button on top of corner icon
            zIndex: 'unset',
          }}
          aria-label={ariaLabel}
        />
      </Tooltip>

      {CornerIcon && (
        <div className="absolute -top-2 -left-2">
          <div className="p-0.5 rounded-full bg-plain-200/75 dark:bg-plain-700/75 backdrop-blur">
            <CornerIcon size="1em" noAriaLabel />
          </div>
        </div>
      )}
    </div>
  );
};
