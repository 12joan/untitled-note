import React, { ElementType } from 'react';
import { DiffOperation, PlateRenderLeafProps } from '~/lib/editor/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';

export const DiffLeaf = ({
  children,
  nodeProps = {},
  attributes,
  leaf,
}: PlateRenderLeafProps) => {
  const diffOperation = leaf.diffOperation as DiffOperation;

  const Component: ElementType = (
    {
      insert: 'ins',
      delete: 'del',
      update: 'span',
    } as const
  )[diffOperation.type];

  const className = groupedClassNames({
    base: 'diff-leaf',
    diffType: {
      insert: 'diff-insert',
      delete: 'diff-delete',
      update: 'diff-update',
    }[diffOperation.type],
  });

  const ariaLabel = diffOperation.type === 'update' ? 'Updated' : undefined;

  return (
    <Component
      {...attributes}
      {...nodeProps}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
};
