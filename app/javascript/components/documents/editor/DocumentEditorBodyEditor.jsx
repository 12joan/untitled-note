import React from 'react'
import { useRef, useEffect } from 'react'
import { TrixEditor } from 'react-trix'

import { useInterval } from 'lib/useTimer'

// Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const escapeRegExp = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const DocumentEditorBodyEditor = props => {
  const editorEl = useRef()
  const ignoreChanges = useRef(true)
  const getEditor = () => editorEl.current.editor

  const handleEditorReady = () => {
    // Prevent loadHTML from sending an update event
    ignoreChanges.current = true

    const editor = getEditor()
    editor.loadHTML(props.doc.body)
    editor.element.addEventListener('click', handleClick)

    ignoreChanges.current = false
  }

  const handleClick = event => {
    const { target } = event

    let actualTarget

    // Open all links with target _blank
    if ((actualTarget = target.closest('a')) !== null) {
      event.preventDefault()
      event.stopPropagation()

      const newAnchorTag = document.createElement('a')
      newAnchorTag.href = actualTarget.href
      newAnchorTag.target = '_blank'
      newAnchorTag.click()
    }

    // Handle clicks on mentions
    if ((actualTarget = target.closest('x-mention')) !== null) {
      event.preventDefault()
      event.stopPropagation()

      alert(actualTarget.innerText)
    }
  }

  const handleChange = body => {
    if (ignoreChanges.current)
      return

    props.updateDocument({ body }, { updateImmediately: false })
  }

  const previousText = useRef()

  const highlightMentions = () => {
    const text = getEditor().getDocument().toString()

    if (previousText.current === text)
      return

    const aliases = ['Project', 'Keyword', 'Document', 'Mention', 'Note App']

    const ranges = aliases.map(alias => {
      const regExp = new RegExp('\\b' + escapeRegExp(alias) + '\\b', 'gi')

      return Array(...text.matchAll(regExp))
        .map(({ index }) => [index, index + alias.length])
    }).flat()

    setMentionRanges(ranges)

    previousText.current = text
  }

  useInterval(highlightMentions, 100)

  const setMentionRanges = ranges => {
    // Adapted from https://embed.plnkr.co/QU3oRc/
    const editor = getEditor()

    const previousSelectedRange = editor.getSelectedRange()
    // Remove all existing mentions
    editor.setSelectedRange([0, editor.getDocument().toString().length])
    editor.deactivateAttribute('mention')

    // Apply mentions
    ranges.forEach(range => {
      editor.setSelectedRange(range)
      editor.activateAttribute('mention')
    })

    // Restore selection state
    editor.setSelectedRange(previousSelectedRange)
  }

  return (
    <TrixEditor
      ref={editorEl}
      toolbar={props.toolbarId}
      placeholder="Add document body"
      onEditorReady={handleEditorReady}
      onChange={handleChange} />
  )
}

export default DocumentEditorBodyEditor
