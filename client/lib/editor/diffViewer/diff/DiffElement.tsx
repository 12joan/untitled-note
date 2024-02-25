import React from 'react';
import { DiffOperation, PlateRenderElementProps } from '@udecode/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Tooltip } from '~/components/Tooltip';
import { diffTypeClassNames, inlineDiffComponents } from './constants';

export const DiffElement = ({
  children,
  element,
  editor,
}: PlateRenderElementProps) => {
  if (!element.diff) return children;
  const diffOperation = element.diffOperation as DiffOperation;

  const inline = editor.isInline(element);

  const Component = inline ? inlineDiffComponents[diffOperation.type] : 'div';

  const className = groupedClassNames({
    block:
      !inline &&
      'rounded-md relative before:absolute before:inset-y-0 before:-left-2 before:w-1 before:rounded-full',
    blockColor: {
      insert: 'before:bg-green-500',
      delete: 'before:bg-red-500',
      update: 'before:bg-yellow-500',
    }[diffOperation.type],
    diffType: diffTypeClassNames[diffOperation.type],
  });

  return (
    <Tooltip content={diffOperation.type}>
      <Component className={className}>{children}</Component>
    </Tooltip>
  );
};
