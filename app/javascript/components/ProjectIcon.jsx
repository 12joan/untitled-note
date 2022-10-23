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

  const bgClassName = {
    auto: 'bg-white text-slate-500 dark:bg-slate-800 darl:text-slate-400',
    light: 'bg-white text-slate-500',
    dark: 'bg-slate-800 text-slate-400',
  }[showText ? project.background_colour : 'auto']

  return (
    <Component
      ref={ref}
      className={`flex items-center justify-center p-1 ${bgClassName} ${className}`}
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
          className="font-bold"
          children={project.emoji ?? abbreviate(project.name, 1)}
          style={{
            transform: project.emoji ? 'scale(1.25)' : undefined,
          }}
        />
      )}
    </Component>
  )
})

export default ProjectIcon
