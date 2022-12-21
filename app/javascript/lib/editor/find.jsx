import React, { useRef, useState, useEffect, useReducer, useMemo } from 'react'
import {
  createPluginFactory,
  getNodeTexts,
  getNode,
  toDOMNode,
} from '@udecode/plate-headless'

import { useContext } from '~/lib/context'
import useStateWhenSettled from '~/lib/useStateWhenSettled'
import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'

import ChevronLeftIcon from '~/components/icons/ChevronLeftIcon'
import ChevronRightIcon from '~/components/icons/ChevronRightIcon'
import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const MARK_FIND_RESULT = 'find_result'
const MARK_FIND_RESULT_CURRENT = 'find_result_current'

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

const useFind = ({ editorRef, restoreSelection, setSelection }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, settledQuery, setQuery, setQueryWithoutWaiting] = useStateWhenSettled('', { debounceTime: 250 })
  const [currentMatch, setCurrentMatch] = useState(undefined)
  const inputRef = useRef()

  const matches = useMemo(() => {
    const editor = editorRef.current
    if (!isOpen || !editor) return []
    return getMatchesInNode(editor, settledQuery).map((match, index) => ({ ...match, index }))
  }, [isOpen, settledQuery])

  // Slate struggles to render a large number of decorations, so we only
  // display up to 100 matches either side of currentMatch.
  const limitedMatches = useMemo(() => {
    if (currentMatch === undefined) return matches.slice(0, 100)
    const start = Math.max(0, currentMatch - 100)
    const end = Math.min(matches.length, currentMatch + 100)
    return matches.slice(start, end)
  }, [matches, currentMatch])

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
      // Close and open the browser find feature
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
    const match = matches[currentMatch]

    if (match === undefined || !editor) return

    const node = getNode(editor, match.anchor.path)
    const domNode = toDOMNode(editor, node)

    domNode.scrollIntoView({ block: 'center' })
  }, [currentMatch, matches])

  // Workaround for decorators being one render behind
  const forceRender = useReducer(x => x + 1, 0)[1]
  useEffect(() => forceRender(), [settledQuery, currentMatch, isOpen])

  return {
    findOptions: {
      matches: isOpen ? limitedMatches : [],
      currentMatch,
    },
    findDialog: isOpen && (
      <FindDialog
        query={query}
        setQuery={setQuery}
        inputRef={inputRef}
        currentMatch={currentMatch + 1}
        totalMatches={matches.length}
        changeMatch={delta => setCurrentMatch((currentMatch + delta + matches.length) % matches.length)}
        showMatches={settledQuery.length > 0 && (matches.length === 0 || currentMatch !== undefined)}
        onClose={close}
      />
    ),
    openFind: open,
  }
}

const useFindPlugins = findOptions => useMemo(() => {
  const makePlugin = ({ key, predicate }) => createPluginFactory({
    key,
    isLeaf: true,
    decorate: (editor, { key, type }) => ([node]) => {
      const { matches, currentMatch } = editor.pluginsByKey[key].options

      return node === editor
        ? matches.map(match => ({
          ...match,
          [type]: predicate({ match, currentMatch }),
        }))
        : []
    },
  })

  return [
    makePlugin({ key: MARK_FIND_RESULT, predicate: ({ match, currentMatch }) => match.index !== currentMatch }),
    makePlugin({ key: MARK_FIND_RESULT_CURRENT, predicate: ({ match, currentMatch }) => match.index === currentMatch }),
  ].map(plugin => plugin({ options: findOptions }))
}, [findOptions])

const FindDialog = ({ query, setQuery, inputRef, currentMatch, totalMatches, changeMatch, showMatches, onClose }) => {
  const { topBarHeight } = useContext()

  const handleKeyDown = event => {
    if (event.key === 'Enter' && totalMatches > 0) {
      changeMatch(1)
    }

    if (event.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="sticky z-[7] h-0" style={{ top: topBarHeight }}>
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
  MARK_FIND_RESULT,
  MARK_FIND_RESULT_CURRENT,
  useFind,
  useFindPlugins,
}
