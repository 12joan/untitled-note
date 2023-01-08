/* Extracted and modified from slate/packages/slate-react/src/plugin/react-editor.ts
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

import { Path } from 'slate'
import { ReactEditor } from 'slate-react'

import { nodeAtPathIsEmptyParagraph } from './utils'

const findDragPath = (editor, event) => {
  if ('nativeEvent' in event) {
    event = event.nativeEvent
  }

  const { clientX: x, clientY: y } = event

  if (x == null || y == null) {
    throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`)
  }

  // Resolve a range from the caret position where the drop occured.
  let domRange

  // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
  if (document.caretRangeFromPoint) {
    domRange = document.caretRangeFromPoint(x, y)
  } else {
    const position = document.caretPositionFromPoint(x, y)

    if (position) {
      domRange = document.createRange()
      domRange.setStart(position.offsetNode, position.offset)
      domRange.setEnd(position.offsetNode, position.offset)
    }
  }

  if (!domRange) {
    throw new Error(`Cannot resolve a Slate range from a DOM event: ${event}`)
  }

  // Resolve a Slate range from the DOM range.
  const range = ReactEditor.toSlateRange(editor, domRange, {
    exactMatch: false,
    suppressThrow: false,
  })

  const path = range.anchor.path.splice(0, 1)

  if (!nodeAtPathIsEmptyParagraph(editor, path)) {
    const domNode = document.querySelectorAll('[data-slate-editor] > *')[path[0]]
    const rect = domNode.getBoundingClientRect()
    const isNext = y - rect.top > rect.top + rect.height - y
    return isNext ? Path.next(path) : path
  }

  return path
}

export default findDragPath
