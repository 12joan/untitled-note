import React, { forwardRef } from 'react';
import { abbreviate } from '~/lib/abbreviate';
import { Project } from '~/lib/types';

export interface ProjectIconProps extends Record<string, any> {
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  project: Project;
  textScale?: number;
}

export const ProjectIcon = forwardRef(
  (
    {
      as: Component = 'div',
      className = '',
      style = {},
      project,
      textScale = 1,
      ...otherProps
    }: ProjectIconProps,
    ref
  ) => {
    const hasImage = !!project.image_url;

    const bgClassName = {
      auto: 'bg-white text-slate-500 dark:bg-slate-800 darl:text-slate-400',
      light: 'bg-white text-slate-500',
      dark: 'bg-slate-800 text-slate-400',
    }[project.background_colour];

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
        {!hasImage && (
          <span
            aria-hidden="true"
            className="font-bold absolute"
            children={project.emoji ?? abbreviate(project.name, 1)}
            style={{
              transform: `scale(${textScale * (project.emoji ? 1.25 : 1)})`,
            }}
          />
        )}
      </Component>
    );
  }
);
