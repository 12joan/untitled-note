import React, { forwardRef } from 'react'

import abbreviate from '~/lib/abbreviate'

const ProjectIcon = forwardRef(({
  as: Component = 'div',
  className = '',
  style = {},
  project,
  showText = true,
  ...otherProps
}, ref) => {
  const hasImage = !!project.image_url

  return (
    <Component
      ref={ref}
      className={`flex items-center justify-center p-1 bg-white dark:bg-slate-800 ${className}`}
      style={{
        '--bg-url': hasImage ? `url(${project.image_url})` : undefined,
        ...style,
      }}
      data-has-bg={hasImage}
      aria-label={project.name}
      {...otherProps}
    >
      {!hasImage && showText && (
        <span
          aria-hidden="true"
          className="font-bold text-slate-500 dark:text-slate-400"
          children={abbreviate(project.name, 1)}
        />
      )}
    </Component>
  )
})

export default ProjectIcon
