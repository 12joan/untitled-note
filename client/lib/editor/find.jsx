import React, { useRef, useState, useEffect, useMemo } from 'react'
import { toDOMRange } from '@udecode/plate-headless'

import { useContext } from '~/lib/context'
import useStateWhenSettled from '~/lib/useStateWhenSettled'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'
import { FIND_SUPPORTED } from '~/lib/environment'

import ChevronLeftIcon from '~/components/icons/ChevronLeftIcon'
import ChevronRightIcon from '~/components/icons/ChevronRightIcon'
import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const HIGHLIGHT_LIMIT = 3000

const forEachTextNode = ({ children }, callback, parentPath = []) => {
  children.forEach((child, index) => {
    const path = [...parentPath, index]

    if (child.text !== undefined) {
      callback(child, path)
    } else if (child.children?.length) {
      forEachTextNode(child, callback, path)
    }
  })
}

const getMatchesInNode = (node, query) => {
  if (query === '') return []

  const matches = []
  const queryLength = query.length
  const lowerCaseQuery = query.toLowerCase()

  forEachTextNode(node, (textNode, path) => {
    const text = textNode.text.toLowerCase()
    let offset = 0

    while (true) {
      const index = text.indexOf(lowerCaseQuery, offset)

      if (index === -1) break

      matches.push({
        anchor: { path, offset: index },
        focus: { path, offset: index + queryLength },
      })

      offset = index + queryLength
    }
  })

  return matches
}

const useFind = ({ editorRef, restoreSelection, setSelection }) => {
  if (!FIND_SUPPORTED) return {}

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [query, settledQuery, rawSetQuery, setQueryWithoutWaiting] = useStateWhenSettled('', { debounceTime: 200 })
  const [matches, setMatches] = useState([])
  const [currentMatch, setCurrentMatch] = useState(undefined)
  const inputRef = useRef()

  // When the find dialog is opened, focus the input
  const open = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current.select(), 0)
  }

  // When the find dialog is closed, reset the query and matches
  const close = () => {
    setIsOpen(false)
    setQueryWithoutWaiting('')
    setMatches([])
    setCurrentMatch(undefined)

    // If the current match exists, select it; otherwise, restore the selection
    const currentMatchRange = currentMatch !== undefined && matches[currentMatch]
    if (currentMatchRange) {
      setSelection(currentMatchRange)
    } else {
      restoreSelection()
    }
  }

  // When the user presses Meta+F, open the find dialog. If the find dialog was
  // already open, close it and let the browser handle the keyboad shortcut.
  useGlobalKeyboardShortcut('MetaF', event => {
    if (event.target === inputRef.current) {
      close()
    } else {
      event.preventDefault()
      open()
    }
  })

  // When the query changes, reset the current match
  const setQuery = query => {
    setCurrentMatch(undefined)
    rawSetQuery(query)
  }

  // Recompute matches when the query changes or the input gains focus, but only
  // if the find dialog is open and the input is focused
  useEffect(() => {
    const editor = editorRef.current

    if (editor && isOpen && isFocused) {
      setMatches(getMatchesInNode(editor, settledQuery))
    }
  }, [isOpen, isFocused, settledQuery])

  // If the current match needs to be set, set it to the first match
  useEffect(() => {
    if (matches.length > 0 && (currentMatch === undefined || currentMatch >= matches.length)) {
      setCurrentMatch(0)
    }
  }, [matches])

  const matchDOMRanges = useMemo(() => matches.map(
    slateRange => (toDOMRange(editorRef.current, slateRange))
  ), [matches])

  // Highlight matches and scroll to the current match
  useEffect(() => {
    const editor = editorRef.current

    if (FIND_SUPPORTED && editor) {
      const [currentMatchRange, otherMatchRanges] = !isFocused || currentMatch === undefined
        ? [undefined, matchDOMRanges]
        : [
          matchDOMRanges[currentMatch],
          matchDOMRanges.slice(0, currentMatch).concat(matchDOMRanges.slice(currentMatch + 1)),
        ]

      // Only highlight up to HIHGLIGHT_LIMIT matches either side of the current match
      const limitedOtherMatchRangesStart = Math.max(0, currentMatch - HIGHLIGHT_LIMIT)
      const limitedOtherMatchRangesEnd = Math.min(matches.length, currentMatch + HIGHLIGHT_LIMIT)
      const limitedOtherMatchRanges = otherMatchRanges.slice(limitedOtherMatchRangesStart, limitedOtherMatchRangesEnd)

      // Passing too many arguments to the Highlight constructor causes an error
      const otherMatchesHighlight = new Highlight()
      limitedOtherMatchRanges.forEach(range => otherMatchesHighlight.add(range))
      CSS.highlights.set('find-result', otherMatchesHighlight)

      if (currentMatchRange) {
        CSS.highlights.set('find-result-current', new Highlight(currentMatchRange))
        currentMatchRange?.startContainer?.parentNode?.scrollIntoView({ block: 'center' })
      } else {
        CSS.highlights.delete('find-result-current')
      }
    }
  }, [matchDOMRanges, currentMatch, isFocused])

  return {
    findDialog: isOpen && (
      <FindDialog
        query={query}
        setQuery={setQuery}
        inputRef={inputRef}
        currentMatch={currentMatch + 1}
        totalMatches={matches.length}
        changeMatch={delta => setCurrentMatch((currentMatch + delta + matches.length) % matches.length)}
        showMatches={settledQuery.length > 0 && (matches.length === 0 || currentMatch !== undefined)}
        setFocused={setIsFocused}
        onClose={close}
      />
    ),
    openFind: open,
  }
}

const FindDialog = ({
  query,
  setQuery,
  inputRef,
  currentMatch,
  totalMatches,
  changeMatch,
  showMatches,
  setFocused,
  onClose,
}) => {
  const containerRef = useRef()
  const { topBarHeight } = useContext()

  const handleInputKeyDown = event => {
    if (event.key === 'Enter' && totalMatches > 0) {
      changeMatch(1)
    }
  }

  const handleContainerKeyDown = event => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  const handleFocus = () => setFocused(true)

  const handleBlur = () => setTimeout(() => {
    if (!containerRef.current?.contains(document.activeElement)) {
      setFocused(false)
    }
  }, 0)

  return (
    <div
      ref={containerRef}
      className="sticky z-[7] h-0"
      style={{ top: topBarHeight }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleContainerKeyDown}
    >
      <div className="narrow bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-lg rounded-lg flex gap-1 items-center pr-2 children:shrink-0">
        <input
          ref={inputRef}
          type="text"
          placeholder="Find in document"
          className="grow w-0 bg-transparent p-3 no-focus-ring"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />

        {showMatches && (totalMatches > 0
          ? (
            <>
              <button type="button" className="btn p-2 aspect-square" onClick={() => changeMatch(-1)}>
                <ChevronLeftIcon size="1.25em" ariaLabel="Previous match" />
              </button>

              <span className="select-none" role="status">
                {currentMatch} of {totalMatches}
              </span>

              <button type="button" className="btn p-2 aspect-square" onClick={() => changeMatch(1)}>
                <ChevronRightIcon size="1.25em" ariaLabel="Next match" />
              </button>
            </>
          )
          : <span className="select-none text-slate-500 dark:text-slate-400" role="status">No matches</span>
        )}

        <button type="button" className="btn p-2 aspect-square" onClick={onClose}>
          <LargeCloseIcon size="1.25em" ariaLabel="Close" />
        </button>
      </div>
    </div>
  )
}

export {
  useFind,
}
