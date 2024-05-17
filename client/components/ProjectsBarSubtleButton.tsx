import React, { ElementType, forwardRef, HTMLAttributes } from 'react';
import { IconProps } from '~/components/icons/makeIcon';

export interface ProjectsBarSubtleButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  icon: ElementType<IconProps>;
  iconSize?: string;
}

export const ProjectsBarSubtleButton = forwardRef<
  HTMLButtonElement,
  ProjectsBarSubtleButtonProps
>(({ icon: Icon, iconSize = '1.25em', ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="size-12 btn flex items-center justify-center p-1 text-plain-400 dark:text-plain-500 hocus:text-plain-500 hocus:dark:text-plain-400"
      {...props}
    >
      <Icon size={iconSize} noAriaLabel />
    </button>
  );
});
