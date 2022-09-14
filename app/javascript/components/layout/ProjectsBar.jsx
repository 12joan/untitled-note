import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import { ProjectLink } from '~/lib/routes'
import abbreviate from '~/lib/abbreviate'

import Tooltip from '~/components/Tooltip'
import Placeholder from '~/components/Placeholder'

const ProjectsBar = forwardRef(({ ...otherProps }, ref) => {
  const { projectId, futureProjects } = useContext()

  return (
    <div className="space-y-3">
      {futureProjects.map(projects => projects.map(project => (
        <Tooltip key={project.id} content={project.name} placement="right">
          <div>
            <ProjectLink
              nav
              projectId={project.id}
              className="btn btn-solid w-full aspect-square border flex items-center justify-center text-xl font-light p-1 dark:border-transparent relative nav-active:no-focus-ring group"
            >
              {abbreviate(project.name, 2)}
              <div className="absolute inset-0 ring ring-slate-700 dark:ring-slate-200 rounded-lg scale-[115%] hidden nav-active:block group-focus-ring" />
            </ProjectLink>
          </div>
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
