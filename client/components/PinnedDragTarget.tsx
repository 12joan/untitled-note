import React from 'react'

import { useContext } from '~/lib/context'
import { useDragTarget } from '~/lib/dragData'
import { pinDocument } from '~/lib/transformDocument'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'

const PinnedDragTarget = ({ children, indicatorClassName = '' }) => {
  const { projectId } = useContext()

  const pinnedDragTargetProps = useDragTarget({
    acceptTypes: ['document'],
    predicate: ({ pinned_at }) => !pinned_at,
    onDrop: (event, doc) => {
      DocumentsAPI(projectId).update(pinDocument(doc))
    },
  })

  return (
    <div {...pinnedDragTargetProps} className="relative">
      {children}

      <div
        className={`hidden data-drag-over:flex pointer-events-none absolute -inset-2 rounded-lg border border-dashed box-border bg-slate-100/50 dark:bg-slate-800/75 ${indicatorClassName}`}
        aria-live="polite"
      >
        <span className="m-auto font-medium text-slate-500 dark:text-slate-400">Drop to pin</span>
      </div>
    </div>
  )
}

export default PinnedDragTarget
