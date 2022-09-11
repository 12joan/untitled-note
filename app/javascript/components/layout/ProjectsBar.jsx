import React, { forwardRef } from 'react'

import { useContext } from '~/lib/context'
import abbreviate from '~/lib/abbreviate'

import Tooltip from '~/components/Tooltip'

const ProjectsBar = forwardRef(({ ...otherProps }, ref) => {
  const { projects } = useContext()

  return (
    <nav
      ref={ref}
      className="fixed top-0 bottom-0 left-0 overflow-y-auto w-20 border-r p-3 bg-slate-100 dark:bg-black/25 dark:border-transparent space-y-3"
      {...otherProps}
    >
        {projects.map(project => (
          <Tooltip key={project.id} content={project.name} placement="right">
            <button className="btn bg-white w-full aspect-square shadow hover:bg-slate-100 flex items-center justify-center text-xl font-light p-1 dark:bg-slate-800 dark:hover:bg-slate-700">
              {abbreviate(project.name, 2)}
            </button>
          </Tooltip>
        ))}
    </nav>
  )
})

export default ProjectsBar
