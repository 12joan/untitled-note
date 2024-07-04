import { NodeEntry } from 'slate';
import { TText } from '~/lib/editor/plate';

export type MarkBoundary =
  | [NodeEntry<TText>, NodeEntry<TText>]
  | [NodeEntry<TText>, null]
  | [null, NodeEntry<TText>];
