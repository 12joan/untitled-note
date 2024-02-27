import React, { HTMLAttributes, ReactNode } from 'react';
import { PlateRenderElementProps } from '@udecode/plate';
import { twMerge } from 'tailwind-merge';

const mergeableProps: (keyof HTMLAttributes<HTMLElement>)[] = ['className'];

export const injectNodeProps = (
  children: ReactNode,
  props: HTMLAttributes<HTMLElement>
) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { nodeProps } = child.props as PlateRenderElementProps;

      Object.keys(props).forEach((key) => {
        const exists = nodeProps && key in nodeProps;
        const mergeable = mergeableProps.includes(key as any);
        if (exists && !mergeable) {
          // eslint-disable-next-line no-console
          console.warn('injectNodeProps: Overwriting existing node prop', key);
        }
      });

      const newProps: Partial<PlateRenderElementProps> = {
        nodeProps: {
          ...nodeProps,
          ...props,
          className: twMerge(nodeProps?.className, props.className),
        },
      };

      return React.cloneElement(child, newProps);
    }

    return child;
  });
