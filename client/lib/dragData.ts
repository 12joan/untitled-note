import { DragEvent, useState } from 'react';
import { PartialDocument } from '~/lib/types';

type BaseDragData = {
  type: string;
  data: any;
};

type DocumentDragData = BaseDragData & {
  type: 'document';
  data: PartialDocument;
};

export type DragData = DocumentDragData;

const makeDragData = <T extends DragData>(type: T['type'], data: T['data']) =>
  ({ type, data } as T);

export const makeDocumentDragData = (doc: PartialDocument): DocumentDragData =>
  makeDragData('document', doc);

let currentDragData: DragData | null = null;

export const handleDragStartWithData =
  (dragData: DragData) => (event: DragEvent) => {
    if (dragData !== null) {
      currentDragData = dragData;
      event.dataTransfer.setData('text/x-note-drag', 'true');
    }
  };

const getDragData = (event: DragEvent): DragData | null => {
  return event.dataTransfer.types.includes('text/x-note-drag')
    ? currentDragData
    : null;
};

export interface UseDragTargetOptions<T extends DragData> {
  type: T['type'];
  predicate?: (data: T['data']) => boolean;
  onDrop: (data: T['data']) => void;
}

export const useDragTarget = <T extends DragData>({
  type,
  predicate = () => true,
  onDrop: handleDrop,
}: UseDragTargetOptions<T>) => {
  const [dragOver, setDragOver] = useState(false);

  const ifAccepts =
    (handler: (event: DragEvent, dragData: T) => void) =>
    (event: DragEvent) => {
      const dragData = getDragData(event);
      if (dragData?.type !== type) return;

      const typedDragData = dragData as T;

      if (predicate(typedDragData.data)) {
        handler(event, typedDragData);
      }
    };

  const onDragOver = ifAccepts((event) => {
    event.preventDefault();
    setDragOver(true);
  });

  const onDragLeave = ifAccepts((event) => {
    event.preventDefault();
    setDragOver(false);
  });

  const onDrop = ifAccepts((event, dragData) => {
    event.preventDefault();
    setDragOver(false);
    handleDrop(dragData.data);
  });

  return {
    onDragOver,
    onDragLeave,
    onDrop,
    'data-drag-over': dragOver ? 'true' : undefined,
  };
};
