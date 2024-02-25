import React from 'react';
import { PlateRenderElementProps } from '@udecode/plate';
import { ExpandChunkButton } from './ExpandChunkButton';
import { ChunkCollapsedProps, ChunkPlugin } from './types';

export const ChunkElement = ({
  children,
  element,
  setExpandedChunks,
}: PlateRenderElementProps & {
  setExpandedChunks: ChunkPlugin['setExpandedChunks'];
}) => {
  if (!element.chunkCollapsed) return children;
  const { chunkIndex, blockCount, showExpandButton } =
    element.chunkCollapsed as ChunkCollapsedProps;

  const mappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        nodeProps: {
          className: 'hidden',
        },
      } as any);
    }
    return child;
  });

  return (
    <>
      {showExpandButton && (
        <ExpandChunkButton
          blockCount={blockCount}
          onClick={() => setExpandedChunks((prev) => [...prev, chunkIndex])}
        />
      )}
      {mappedChildren}
    </>
  );
};
