import { useState } from 'react'

const makeDragData = (type, data) => ({ type, data })

const makeDocumentDragData = doc => makeDragData('document', {
  id: doc.id,
  pinned_at: doc.pinned_at,
  remote_version: doc.remote_version,
})

const handleDragStartWithData = dragData => event => {
  if (dragData !== undefined) {
    event.dataTransfer.setData('text/x-note-data', JSON.stringify(dragData))
  }
}

const getDragData = event => {
  const data = event.dataTransfer.getData('text/x-note-data')
  return data ? JSON.parse(data) : undefined
}

const useDragTarget = ({ acceptTypes, predicate = () => true, onDrop: handleDrop }) => {
  const [dragOver, setDragOver] = useState(false)

  const ifAccepts = handler => event => {
    const dragData = getDragData(event)

    if (dragData !== undefined && acceptTypes.includes(dragData.type) && predicate(dragData.data)) {
      handler(event, dragData)
    }
  }

  const onDragOver = ifAccepts(event => {
    event.preventDefault()
    setDragOver(true)
  })

  const onDragLeave = ifAccepts(event => {
    event.preventDefault()
    setDragOver(false)
  })

  const onDrop = ifAccepts((event, dragData) => {
    event.preventDefault()
    setDragOver(false)
    handleDrop(dragData.type, dragData.data)
  })

  return {
    onDragOver,
    onDragLeave,
    onDrop,
    'data-drag-over': dragOver ? 'true' : undefined,
  }
}

export {
  makeDocumentDragData,
  handleDragStartWithData,
  useDragTarget,
}
