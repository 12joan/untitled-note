import { createPluginFactory } from '~/lib/editor/plate';
import { withGetFragmentExcludeProps } from '../withGetFragmentExcludeProps';
import { DiffElement } from './DiffElement';
import { DiffLeaf } from './DiffLeaf';

export const createDiffPlugin = createPluginFactory({
  key: 'diff',
  isLeaf: true,
  component: DiffLeaf,
  withOverrides: withGetFragmentExcludeProps('diff', 'diffOperation'),
  inject: {
    aboveComponent: () => DiffElement,
  },
});
