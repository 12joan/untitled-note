import React from 'react';
import { DiffOperation, PlateRenderLeafProps } from '@udecode/plate';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { diffTypeClassNames, inlineDiffComponents } from './constants';

export const DiffLeaf = ({
  children,
  nodeProps = {},
  attributes,
  leaf,
}: PlateRenderLeafProps) => {
  const diffOperation = leaf.diffOperation as DiffOperation;

  const Component = inlineDiffComponents[diffOperation.type];

  const className = groupedClassNames({
    diffType: diffTypeClassNames[diffOperation.type],
  });

  return (
    <Component {...attributes} {...nodeProps} className={className}>
      {children}
    </Component>
  );
};
