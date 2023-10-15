import React, { ReactNode } from 'react';
import { updateDocument } from '~/lib/apis/document';
import { useAppContext } from '~/lib/appContext';
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
  const projectId = useAppContext('projectId');

  const pinnedDragTargetProps = useDragTarget({
    type: 'document',
    predicate: (document) => !document.pinned_at,
    onDrop: (doc) => updateDocument(projectId, doc.id, pinDocument(doc)),
  });

  return (
    <div {...pinnedDragTargetProps} className="relative">
      {children}

      <div
        className={`hidden data-drag-over:flex pointer-events-none absolute -inset-2 rounded-lg border border-dashed box-border bg-plain-100/50 dark:bg-plain-800/75 ${indicatorClassName}`}
        aria-live="polite"
      >
        <span className="m-auto font-medium text-plain-500 dark:text-plain-400">
          Drop to pin
        </span>
      </div>
    </div>
  );
};
