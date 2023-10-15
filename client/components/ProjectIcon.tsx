import React, {
  CSSProperties,
  ElementType,
  forwardRef,
  ReactElement,
} from 'react';
import { abbreviate } from '~/lib/abbreviate';
import { PolyProps, PolyRef } from '~/lib/polymorphic';
import { Project } from '~/lib/types';

export type ProjectIconProps<C extends ElementType> = PolyProps<
  C,
  {
    project: Project;
    textScale?: number;
    className?: string;
    style?: CSSProperties;
  }
>;

type ProjectIconComponent = <C extends ElementType = 'div'>(
  props: ProjectIconProps<C>
) => ReactElement | null;

export const ProjectIcon: ProjectIconComponent = forwardRef(
  <C extends ElementType = 'div'>(
    {
      as,
      className = '',
      style = {},
      project,
      textScale = 1,
      ...otherProps
    }: ProjectIconProps<C>,
    ref: PolyRef<C>
  ) => {
    const Component = as || 'div';

    const hasImage = !!project.image_url;

    const bgClassName = {
      auto: 'bg-white text-plain-500 dark:bg-plain-800 dark:text-plain-400',
      light: 'bg-white text-plain-500',
      dark: 'bg-plain-800 text-plain-400',
    }[project.background_colour];

    return (
      <Component
        ref={ref}
        className={`flex items-center justify-center p-1 ${bgClassName} ${className}`}
        style={
          {
            '--bg-url': hasImage ? `url(${project.image_url})` : undefined,
            ...style,
          } as CSSProperties
        }
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
