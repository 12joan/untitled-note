import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import { ProjectLink } from '~/lib/routes'
import abbreviate from '~/lib/abbreviate'

import Tooltip from '~/components/Tooltip'
import Placeholder from '~/components/Placeholder'

const ProjectsBar = forwardRef(({ onButtonClick = () => {}, ...otherProps }, ref) => {
  const { projectId, futureProjects } = useContext()

  return (
    <div className="space-y-3 p-3">
      {futureProjects.map(projects => projects.map(project => {
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
      })).orDefault(
        <>
          {[...Array(4)].map((_, index) => (
            <Placeholder key={index} className="w-12 aspect-square rounded-lg" />
          ))}
        </>
      )}
    </div>
  )
})

export default ProjectsBar
