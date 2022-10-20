import React, { forwardRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { useContext } from '~/lib/context'
import useNewProject from '~/lib/useNewProject'
import useOverrideable from '~/lib/useOverrideable'
import ProjectOrderAPI from '~/lib/resources/ProjectOrderAPI'
import { handleReorderProjectsError } from '~/lib/handleErrors'
import { ProjectLink, OverviewLink } from '~/lib/routes'

import Tooltip from '~/components/Tooltip'
import ProjectIcon from '~/components/ProjectIcon'
import LargePlusIcon from '~/components/icons/LargePlusIcon'

const ProjectsBar = forwardRef(({ onButtonClick = () => {}, ...otherProps }, ref) => {
  const { projectId, projects } = useContext()
  const openNewProjectModal = useNewProject()

  const [localProjects, setLocalProjects] = useOverrideable(projects)

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return

    const newProjects = Array.from(localProjects)
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
            className="p-3 pl-0"
          >
            {localProjects.map((project, index) => {
              const isCurrentProject = project.id == projectId
              const LinkComponent = isCurrentProject ? OverviewLink : ProjectLink

              return (
                <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                  {provided => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex gap-2 mb-3"
                    >
                      <div
                        aria-hidden="true"
                        className="opacity-0 data-active:opacity-100 -ml-1 my-2 w-2 h-8 rounded-full bg-primary-500 dark:bg-primary-400 window-inactive:bg-slate-500 dark:window-inactive:bg-slate-400"
                        data-active={isCurrentProject}
                      />

                      <Tooltip content={project.name} placement="right" fixed>
                        <ProjectIcon
                          project={project}
                          {...provided.dragHandleProps}
                          // Link props
                          as={isCurrentProject ? OverviewLink : ProjectLink}
                          projectId={project.id}
                          // HTML attributes
                          className="w-12 h-12 btn text-xl shadow"
                          onClick={onButtonClick}
                          aria-current={isCurrentProject ? 'page' : undefined}
                        />
                      </Tooltip>
                    </div>
                  )}
                </Draggable>
              )
            })}

            {provided.placeholder}

            <div className="pl-3">
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
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
})

export default ProjectsBar
