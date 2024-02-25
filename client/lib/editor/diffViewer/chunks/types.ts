import { Dispatch, SetStateAction } from 'react';

export interface ChunkPlugin {
  setExpandedChunks: Dispatch<SetStateAction<number[]>>;
}

export interface ChunkCollapsedProps {
  chunkIndex: number;
  blockCount: number;
  showExpandButton: boolean;
}
