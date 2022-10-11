import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import { ProjectLink } from '~/lib/routes'
import abbreviate from '~/lib/abbreviate'
import useNewProject from '~/lib/useNewProject'

import Tooltip from '~/components/Tooltip'
import LargePlusIcon from '~/components/icons/LargePlusIcon'

const ProjectsBar = forwardRef(({ onButtonClick = () => {}, ...otherProps }, ref) => {
  const { projectId, projects } = useContext()
  const openNewProjectModal = useNewProject()

  return (
    <div className="space-y-3 p-3">
      {projects.map(project => {
        const isCurrentProject = project.id == projectId

        return (
          <Tooltip key={project.id} content={project.name} placement="right">
            <ProjectLink
              projectId={project.id}
              data-active={isCurrentProject}
              className="w-12 btn btn-solid aspect-square flex items-center justify-center p-1 relative shadow"
              onClick={onButtonClick}
              aria-label={project.name}
              aria-current={isCurrentProject ? 'page' : undefined}
            >
              <span
                aria-hidden="true"
                className="font-bold text-xl text-slate-500 dark:text-slate-400"
                children={abbreviate(project.name, 1)}
              />

              <div
                aria-hidden="true"
                className="hidden data-active:block absolute inset-y-2 -left-3 -translate-x-1/2 rounded-full w-2 bg-primary-500 dark:bg-primary-400 window-inactive:bg-slate-500 dark:window-inactive:bg-slate-400"
              />
            </ProjectLink>
          </Tooltip>
        )
      })}

      <Tooltip content="New project" placement="right">
        <button
          type="button"
          className="w-12 btn aspect-square flex items-center justify-center p-1 hocus:bg-black/5 dark:hocus:bg-white/5 text-slate-400 dark:text-slate-500 hocus:text-slate-500 hocus:dark:text-slate-400"
          onClick={openNewProjectModal}
        >
          <LargePlusIcon size="2em" ariaLabel="New project" />
        </button>
      </Tooltip>
    </div>
  )
})

export default ProjectsBar
