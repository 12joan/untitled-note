import React, { useMemo, useState, useId, forwardRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { useContext } from '~/lib/context'
import groupList from '~/lib/groupList'
import useNewProject from '~/lib/useNewProject'
import useOverrideable from '~/lib/useOverrideable'
import ProjectOrderAPI from '~/lib/resources/ProjectOrderAPI'
import { handleReorderProjectsError } from '~/lib/handleErrors'
import { ProjectLink, OverviewLink } from '~/lib/routes'

import Tooltip from '~/components/Tooltip'
import ProjectIcon from '~/components/ProjectIcon'
import ChevronUpIcon from '~/components/icons/ChevronUpIcon'
import LargePlusIcon from '~/components/icons/LargePlusIcon'

const ProjectsBar = forwardRef(({ onButtonClick = () => {}, ...otherProps }, ref) => {
  const { projectId, projects } = useContext()
  const openNewProjectModal = useNewProject()

  const [localProjects, setLocalProjects] = useOverrideable(projects)

  const {
    archivedProjects = [],
    unarchivedProjects = [],
  } = useMemo(
    () => groupList(
      localProjects,
      project => project.archived_at ? 'archivedProjects' : 'unarchivedProjects'
    ),
    [localProjects]
  )

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return

    const newProjects = [...unarchivedProjects, ...archivedProjects]
    const [removed] = newProjects.splice(source.index, 1)
    newProjects.splice(destination.index, 0, removed)
    setLocalProjects(newProjects)

    handleReorderProjectsError(
      ProjectOrderAPI.update({
        order: newProjects.map(({ id }) => id),
      })
    ).catch(() => setLocalProjects(localProjects))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects" direction="vertical">
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-3"
          >
            <ProjectList
              projects={unarchivedProjects}
              draggable
              onButtonClick={onButtonClick}
            />

            {provided.placeholder}

            {archivedProjects.length > 0 && (
              <ProjectFolder
                name="Archived projects"
                projects={archivedProjects}
                initialExpanded={archivedProjects.some(({ id }) => id === projectId)}
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
  )
})

const ProjectFolder = ({ name, projects, initialExpanded = false, onButtonClick }) => {
  const [isExpanded, setIsExpanded] = useOverrideable(initialExpanded)
  const id = useId()

  const buttonProps = {
    type: 'button',
    onClick: () => setIsExpanded(!isExpanded),
    'aria-controls': id,
    'aria-expanded': isExpanded,
  }

  return (
    <div className="mb-3">
      <div className={`-m-1 rounded-xl p-1 ${isExpanded ? 'bg-slate-200 dark:bg-black/75' : ''}`}>
        <div className="-mb-3">
          <div className="mb-3">
            <Tooltip content="Archived projects" placement="right" fixed>
              {isExpanded ? (
                <button
                  {...buttonProps}
                  className="btn w-12 h-12 flex justify-center items-center text-slate-400 dark:text-slate-500"
                >
                  <ChevronUpIcon size="2em" ariaLabel="Collapse folder" />
                </button>
              ) : (
                <button
                  {...buttonProps}
                  className="btn w-12 h-12 border border-dashed p-1.5 grid gap-1 grid-cols-2 border-slate-400 dark:border-slate-500"
                >
                  <div className="rounded shadow-sm bg-white dark:bg-slate-800" />
                  <div className="rounded shadow-sm bg-white dark:bg-slate-800" />
                  <div className="rounded shadow-sm bg-white dark:bg-slate-800" />
                  <div className="rounded shadow-sm bg-white dark:bg-slate-800" />
                </button>
              )}
            </Tooltip>
          </div>

          <div id={id}>
            {isExpanded && (
              <ProjectList projects={projects} onButtonClick={onButtonClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProjectList = ({ projects, draggable = false, onButtonClick }) => {
  const { projectId } = useContext()

  return projects.map((project, index) => {
    const isCurrentProject = project.id == projectId
    const LinkComponent = isCurrentProject ? OverviewLink : ProjectLink

    const wrapper = renderFunc => draggable ? (
      <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
        {provided => renderFunc({
          containerProps: {
            ref: provided.innerRef,
            ...provided.draggableProps,
          },
          handleProps: provided.dragHandleProps,
        })}
      </Draggable>
    ) : renderFunc({
      containerProps: { key: project.id },
      handleProps: {},
    })

    return wrapper(({ containerProps, handleProps }) => (
      <div
        {...containerProps}
        className="flex gap-2 -ml-3 mb-3"
      >
        <div
          aria-hidden="true"
          className="opacity-0 data-active:opacity-100 -ml-1 my-2 w-2 h-8 rounded-full bg-primary-500 dark:bg-primary-400 window-inactive:bg-slate-500 dark:window-inactive:bg-slate-400"
          data-active={isCurrentProject}
        />

        <Tooltip content={project.name} placement="right" fixed>
          <ProjectIcon
            project={project}
            {...handleProps}
            // Link props
            as={isCurrentProject ? OverviewLink : ProjectLink}
            projectId={project.id}
            // HTML attributes
            className="w-12 h-12 btn text-xl shadow"
            style={{ cursor: 'pointer' }}
            onClick={onButtonClick}
            aria-current={isCurrentProject ? 'page' : undefined}
          />
        </Tooltip>
      </div>
    ))
  })
}

export default ProjectsBar
