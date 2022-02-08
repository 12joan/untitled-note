import React from 'react'
import { useRef, useEffect } from 'react'
import { TrixEditor } from 'react-trix'

import { useContext } from 'lib/context'
import { useInterval } from 'lib/useTimer'

const DocumentEditorBodyEditor = props => {
  const { mentionables: mentionablesByDocument, setParams } = useContext()

  const mentionables = Object.values({ ...mentionablesByDocument, [props.doc.id]: [] }).flat()

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

    highlightMentions()
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

      const mentionText = actualTarget.innerText

      for (const [documentId, mentionables] of Object.entries(mentionablesByDocument)) {
        if (mentionables.some(mentionable => mentionable.toLowerCase() === mentionText.toLowerCase())) {
          setParams({ keywordId: undefined, documentId })
          break
        }
      }
    }
  }

  const handleChange = body => {
    if (ignoreChanges.current)
      return

    props.updateDocument({ body }, { updateImmediately: false })
  }

  const previousRanges = useRef()

  const highlightMentions = () => {
    const text = getEditor().getDocument().toString()

    const ranges = mentionables.map(mentionable => {
      // escapeRegExp adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      const escapeRegExp = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      const regExp = new RegExp('\\b' + escapeRegExp(mentionable) + '\\b', 'gi')

      return Array(...text.matchAll(regExp))
        .map(({ index }) => [index, index + mentionable.length])
    }).flat()

    if (previousRanges.current?.toString() !== ranges.toString()) {
      setMentionRanges(ranges)
      previousRanges.current = ranges
    }
  }

  useInterval(highlightMentions, 200, [mentionables])

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
