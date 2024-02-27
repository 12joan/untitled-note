import React from 'react';
import { PlateRenderElementProps } from '@udecode/plate';
import { injectNodeProps } from '../../injectNodeProps';
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

  const mappedChildren = injectNodeProps(children, { className: 'hidden' });

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
