/* Extracted and modified from slate/packages/slate-react/src/utils/diff-text.ts
 *
 * The MIT License
 *
 * Copyright © 2016–2023, Ian Storm Taylor
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Editor, Node, Path, Range, Text } from 'slate';

/**
 * Normalize a 'pending point' a.k.a a point based on the dom state before applying
 * the pending diffs. Since the pending diffs might have been inserted with different
 * marks we have to 'walk' the offset from the starting position to ensure we still
 * have a valid point inside the document
 */
function normalizePoint(editor, point) {
  let { path, offset } = point;
  if (!Editor.hasPath(editor, path)) {
    return null;
  }

  let leaf = Node.get(editor, path);
  if (!Text.isText(leaf)) {
    return null;
  }

  const parentBlock = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
    at: path,
  });

  if (!parentBlock) {
    return null;
  }

  while (offset > leaf.text.length) {
    const entry = Editor.next(editor, { at: path, match: Text.isText });
    if (!entry || !Path.isDescendant(entry[1], parentBlock[1])) {
      return null;
    }

    offset -= leaf.text.length;
    [leaf, path] = entry;
  }

  return { path, offset };
}

/**
 * Normalize a 'pending selection' to ensure it's valid in the current document state.
 */
function normalizeRange(editor, range) {
  const anchor = normalizePoint(editor, range.anchor);
  if (!anchor) {
    return null;
  }

  if (Range.isCollapsed(range)) {
    return { anchor, focus: anchor };
  }

  const focus = normalizePoint(editor, range.focus);
  if (!focus) {
    return null;
  }

  return { anchor, focus };
}

export default normalizeRange;
