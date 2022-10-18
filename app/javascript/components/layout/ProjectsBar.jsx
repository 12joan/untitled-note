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
    <div className="space-y-3 p-3 pl-0">
      {projects.map(project => {
        const isCurrentProject = project.id == projectId

        const hasImage = !!project.image_url

        return (
          <div key={project.id} className="flex gap-2">
            <div
              aria-hidden="true"
              className="opacity-0 data-active:opacity-100 -ml-1 my-2 w-2 h-8 rounded-full bg-primary-500 dark:bg-primary-400 window-inactive:bg-slate-500 dark:window-inactive:bg-slate-400"
              data-active={isCurrentProject}
            />

            <Tooltip content={project.name} placement="right" fixed>
              <ProjectLink
                projectId={project.id}
                className="w-12 h-12 btn flex items-center justify-center p-1 shadow bg-white dark:bg-slate-800"
                style={{
                  '--bg-url': hasImage ? `url(${project.image_url})` : undefined
                }}
                data-has-bg={hasImage}
                onClick={onButtonClick}
                aria-label={project.name}
                aria-current={isCurrentProject ? 'page' : undefined}
              >
                {!hasImage && (
                  <span
                    aria-hidden="true"
                    className="font-bold text-xl text-slate-500 dark:text-slate-400"
                    children={abbreviate(project.name, 1)}
                  />
                )}
              </ProjectLink>
            </Tooltip>
          </div>
        )
      })}

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
  )
})

export default ProjectsBar
