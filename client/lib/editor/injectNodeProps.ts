import React, { type HTMLAttributes, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import type { PlateRenderElementProps } from '~/lib/editor/plate';

const mergeableProps: (keyof HTMLAttributes<HTMLElement>)[] = ['className'];

export const injectNodeProps = (
  children: ReactNode,
  props: HTMLAttributes<HTMLElement>
) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { nodeProps } = child.props as PlateRenderElementProps;

      for (const key of Object.keys(props)) {
        const exists = nodeProps && key in nodeProps;
        const mergeable = mergeableProps.includes(key as any);
        if (exists && !mergeable) {
          // biome-ignore lint/suspicious/noConsole: logging
          console.warn('injectNodeProps: Overwriting existing node prop', key);
        }
      }

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
