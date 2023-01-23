import React, { useRef, useState, useEffect, useMemo } from 'react'
import {
  getNodeTexts,
  getNode,
  toDOMRange,
} from '@udecode/plate-headless'

import { useContext } from '~/lib/context'
import useStateWhenSettled from '~/lib/useStateWhenSettled'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'

import ChevronLeftIcon from '~/components/icons/ChevronLeftIcon'
import ChevronRightIcon from '~/components/icons/ChevronRightIcon'
import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const ENABLE_FIND_FEATURE = navigator.userAgent.includes('enable-find-feature') && ('highlights' in CSS)

const getMatchesInNode = (node, query) => {
  if (query === '') return []

  const textNodesWithPaths = [...getNodeTexts(node)]

  return textNodesWithPaths.flatMap(([textNode, path]) => {
    const [firstPart, ...otherParts] = textNode.text.toLowerCase().split(query.toLowerCase())
    const initialOffset = firstPart.length

    return otherParts.reduce(({ matches, offset }, part) => ({
      matches: [
        ...matches,
        {
          anchor: { path, offset },
          focus: { path, offset: offset + query.length },
        },
      ],
      offset: offset + part.length + query.length,
    }), { matches: [], offset: initialOffset }).matches
  })
}

const makeDOMRangeStatic = ({ startContainer, startOffset, endContainer, endOffset }) => new StaticRange({
  startContainer,
  startOffset,
  endContainer,
  endOffset,
})

const useFind = ({ editorRef, restoreSelection, setSelection }) => {
  if (!ENABLE_FIND_FEATURE) return {}

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [query, settledQuery, setQuery, setQueryWithoutWaiting] = useStateWhenSettled('', { debounceTime: 200 })
  const [currentMatch, setCurrentMatch] = useState(undefined)
  const inputRef = useRef()

  const matches = useMemo(() => {
    const editor = editorRef.current
    if (!isOpen || !isFocused || !editor) return []
    return getMatchesInNode(editor, settledQuery)
  }, [isOpen, isFocused, settledQuery])

  const matchDOMRanges = useMemo(() => matches.map(
    slateRange => makeDOMRangeStatic(toDOMRange(editorRef.current, slateRange))
  ), [matches])

  const open = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current.select(), 0)
  }

  const close = () => {
    setIsOpen(false)
    setQuery('')
    setCurrentMatch(undefined)

    if (matches.length > 0 && currentMatch !== undefined) {
      setSelection(matches[currentMatch])
    } else {
      restoreSelection()
    }
  }

  useGlobalKeyboardShortcut('MetaF', event => {
    if (event.target === inputRef.current) {
      // Close and open the browser find feature (if available)
      close()
    } else {
      event.preventDefault()
      open()
    }
  })

  useEffect(() => {
    if (matches.length === 0) {
      setCurrentMatch(undefined)
    } else {
      setCurrentMatch(0)
    }
  }, [settledQuery])

  useEffect(() => {
    const editor = editorRef.current

    if (ENABLE_FIND_FEATURE && editor) {
      const [currentMatchRange, otherMatchRanges] = currentMatch === undefined
        ? [undefined, matchDOMRanges]
        : [
          matchDOMRanges[currentMatch],
          matchDOMRanges.slice(0, currentMatch).concat(matchDOMRanges.slice(currentMatch + 1)),
        ]

      CSS.highlights.set('find-result', new Highlight(...otherMatchRanges))

      if (currentMatchRange) {
        CSS.highlights.set('find-result-current', new Highlight(currentMatchRange))

        currentMatchRange.startContainer.parentNode.scrollIntoView({ block: 'center' })
      } else {
        CSS.highlights.delete('find-result-current')
      }
    }
  }, [matchDOMRanges, currentMatch])

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

  const handleKeyDown = event => {
    if (event.key === 'Enter' && totalMatches > 0) {
      changeMatch(1)
    }

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
    <div ref={containerRef} className="sticky z-[7] h-0" style={{ top: topBarHeight }} onFocus={handleFocus} onBlur={handleBlur}>
      <div className="narrow bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-lg rounded-lg flex gap-1 items-center pr-2 children:shrink-0">
        <input
          ref={inputRef}
          type="text"
          placeholder="Find in document"
          className="grow w-0 bg-transparent p-3 no-focus-ring"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
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
