import { useEffect } from 'react'
import { toDOMNode, select } from '@udecode/plate-headless'

import useEffectAfterFirst from '~/lib/useEffectAfterFirst'

const selectionRestorationForDocument = {}
const scrollRestorationForDocument = {}

const useSaveSelection = (documentId, editor) => useEffectAfterFirst(() => {
  selectionRestorationForDocument[documentId] = editor.selection
}, [editor.selection])

const useSaveScroll = documentId => useEffect(() => {
  const updateScroll = () => {
    scrollRestorationForDocument[documentId] = window.scrollY
  }

  setTimeout(() => {
    window.addEventListener('scroll', updateScroll)
    updateScroll()
  }, 1000)

  return () => window.removeEventListener('scroll', updateScroll)
}, [])

const getEditorDOMNode = editor => toDOMNode(editor, editor)

const setSelection = (editor, selection) => {
  getEditorDOMNode(editor).focus({ preventScroll: true })

  // Handle case where the old selection is no longer valid (e.g. the
  // document has been changed in the meantime).
  if (selection) {
    select(editor, selection)
  }
}

const setScroll = scroll => {
  if (scroll) {
    window.scrollTo(0, scroll)
  }
}

const restoreSelection = (documentId, editor) => setSelection(editor, selectionRestorationForDocument[documentId])
const restoreScroll = documentId => setScroll(scrollRestorationForDocument[documentId])

export {
  useSaveSelection,
  useSaveScroll,
  setSelection,
  setScroll,
  restoreSelection,
  restoreScroll,
}
