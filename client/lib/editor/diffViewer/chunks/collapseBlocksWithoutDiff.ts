import { Value } from '~/lib/editor/plate';
import { hasDiff } from '../diff/hasDiff';
import { chunkDiffs } from './chunkDiffs';
import { ChunkCollapsedProps } from './types';

export interface CollapseBlocksWithoutDiffOptions {
  expandedChunks: number[];
}

export const collapseBlocksWithoutDiff = (
  value: Value,
  { expandedChunks }: CollapseBlocksWithoutDiffOptions
) => {
  const diffChunks = chunkDiffs(value, {
    hasDiff,
    paddingBlocks: 1,
  });

  const collapsedValue = diffChunks.flatMap(({ blocks, hasDiff }, chunkIndex) =>
    hasDiff || expandedChunks.includes(chunkIndex)
      ? blocks
      : blocks.map((block, blockIndex) => ({
          ...block,
          chunkCollapsed: {
            chunkIndex,
            blockCount: blocks.length,
            showExpandButton: blockIndex === 0,
          } satisfies ChunkCollapsedProps,
        }))
  );

  return collapsedValue;
};
