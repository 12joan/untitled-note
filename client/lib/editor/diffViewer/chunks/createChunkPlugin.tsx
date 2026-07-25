import { createPluginFactory } from '~/lib/editor/plate';
import { withGetFragmentExcludeProps } from '../withGetFragmentExcludeProps';
import { ChunkElement } from './ChunkElement';
import type { ChunkPlugin } from './types';

export const createChunkPlugin = createPluginFactory<ChunkPlugin>({
  key: 'chunk',
  withOverrides: withGetFragmentExcludeProps('chunkCollapsed'),
  then: (_editor, { options: { setExpandedChunks } }) => ({
    inject: {
      aboveComponent: () => (props) => (
        <ChunkElement setExpandedChunks={setExpandedChunks} {...props} />
      ),
    },
  }),
});
