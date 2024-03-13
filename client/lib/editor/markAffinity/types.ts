import { TText } from '@udecode/plate';
import { NodeEntry } from 'slate';

export type MarkBoundary =
  | [NodeEntry<TText>, NodeEntry<TText>]
  | [NodeEntry<TText>, null]
  | [null, NodeEntry<TText>];
