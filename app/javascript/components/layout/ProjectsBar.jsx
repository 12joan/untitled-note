import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import { ProjectLink } from '~/lib/routes'
import abbreviate from '~/lib/abbreviate'

import Tooltip from '~/components/Tooltip'
import Placeholder from '~/components/Placeholder'

const ProjectsBar = forwardRef(({ onButtonClick = () => {}, ...otherProps }, ref) => {
  const { projectId, futureProjects } = useContext()

  return (
    <div className="space-y-3">
      {futureProjects.map(projects => projects.map(project => (
        <Tooltip key={project.id} content={project.name} placement="right">
          <ProjectLink
            nav
            projectId={project.id}
            className="btn btn-solid w-full aspect-square border flex items-center justify-center font-light p-1 dark:border-transparent relative nav-active:no-focus-ring group"
            onClick={onButtonClick}
          >
            {abbreviate(project.name, 2)}
            <div className="absolute -inset-1 ring ring-slate-700 dark:ring-slate-300 rounded-xl hidden nav-active:block group-focus-ring" />
          </ProjectLink>
        </Tooltip>
      ))).orDefault(
        <>
          {[...Array(4)].map((_, index) => (
            <Placeholder key={index} className="w-full aspect-square" />
          ))}
        </>
      )}
    </div>
  )
})

export default ProjectsBar
