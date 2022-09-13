import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import abbreviate from '~/lib/abbreviate'

import Tooltip from '~/components/Tooltip'

const ProjectsBar = forwardRef(({ ...otherProps }, ref) => {
  const { projects } = useContext()

  return (
    <div className="space-y-3">
      {projects.map(project => (
        <Tooltip key={project.id} content={project.name} placement="right">
          <button className="btn btn-solid w-full aspect-square border flex items-center justify-center text-xl font-light p-1 dark:border-transparent">
            {abbreviate(project.name, 2)}
          </button>
        </Tooltip>
      ))}
    </div>
  )
})

export default ProjectsBar
