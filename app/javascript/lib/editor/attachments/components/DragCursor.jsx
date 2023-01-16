import React, { useMemo } from 'react'

import { useGlobalStore } from '~/lib/globalStores'
import cssAdd from '~/lib/cssAdd'

const DragCursor = () => {
  const position = useGlobalStore('dragCursorPosition', null, false)

  const { left, right, y } = useMemo(() => {
    if (position === null) {
      return {}
    }

    const children = Array.from(document.querySelectorAll('[data-slate-editor] > *'))
    const isBelowLast = position >= children.length

    const child = isBelowLast
      ? children[children.length - 1]
      : children[position]

    if (!child) {
      return {}
    }

    const { left, right, top, bottom } = child.getBoundingClientRect()

    return {
      left,
      right: window.innerWidth - right,
      y: isBelowLast ? bottom : top,
    }
  }, [position])

  return position !== null && (
    <div
      className="h-1 rounded-full bg-primary-500 dark:bg-primary-400 fixed pointer-events-none -translate-y-1/2"
      style={{
        left,
        right,
        top: cssAdd(y, '-0.375rem'),
      }}
    />
  )
}

export default DragCursor
