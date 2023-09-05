import React, { ReactNode } from 'react';
import { updateDocument } from '~/lib/apis/document';
import { useContext } from '~/lib/context';
import { useDragTarget } from '~/lib/dragData';
import { pinDocument } from '~/lib/transformDocument';

export interface PinnedDragTargetProps {
  indicatorClassName?: string;
  children: ReactNode;
}

export const PinnedDragTarget = ({
  indicatorClassName = '',
  children,
}: PinnedDragTargetProps) => {
  const { projectId } = useContext() as { projectId: number };

  const pinnedDragTargetProps = useDragTarget({
    type: 'document',
    predicate: (document) => !document.pinned_at,
    onDrop: (doc) => updateDocument(projectId, doc.id, pinDocument(doc)),
  });

  return (
    <div {...pinnedDragTargetProps} className="relative">
      {children}

      <div
        className={`hidden data-drag-over:flex pointer-events-none absolute -inset-2 rounded-lg border border-dashed box-border bg-slate-100/50 dark:bg-slate-800/75 ${indicatorClassName}`}
        aria-live="polite"
      >
        <span className="m-auto font-medium text-slate-500 dark:text-slate-400">
          Drop to pin
        </span>
      </div>
    </div>
  );
};
