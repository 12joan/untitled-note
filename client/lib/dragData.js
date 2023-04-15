import { useState } from 'react';

const makeDragData = (type, data) => ({ type, data });

const makeDocumentDragData = (doc) =>
  makeDragData('document', {
    id: doc.id,
    pinned_at: doc.pinned_at,
    remote_version: doc.remote_version,
  });

let currentDragData;

const handleDragStartWithData = (dragData) => (event) => {
  if (dragData !== undefined) {
    currentDragData = dragData;
    event.dataTransfer.setData('text/x-note-drag', 'true');
  }
};

const getDragData = (event) => {
  return event.dataTransfer.types.includes('text/x-note-drag')
    ? currentDragData
    : undefined;
};

const useDragTarget = ({
  acceptTypes,
  predicate = () => true,
  onDrop: handleDrop,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const ifAccepts = (handler) => (event) => {
    const dragData = getDragData(event);

    if (
      dragData !== undefined &&
      acceptTypes.includes(dragData.type) &&
      predicate(dragData.data)
    ) {
      handler(event, dragData);
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
    handleDrop(dragData.type, dragData.data);
  });

  return {
    onDragOver,
    onDragLeave,
    onDrop,
    'data-drag-over': dragOver ? 'true' : undefined,
  };
};

export { makeDocumentDragData, handleDragStartWithData, useDragTarget };
