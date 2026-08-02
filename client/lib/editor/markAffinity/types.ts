import type { NodeEntry } from 'slate';
import type { TText } from '~/lib/editor/plate';

export type MarkBoundary =
  | [NodeEntry<TText>, NodeEntry<TText>]
  | [NodeEntry<TText>, null]
  | [null, NodeEntry<TText>];
