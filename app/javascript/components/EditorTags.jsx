import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import CloseIcon from '~/components/icons/CloseIcon'
import PlusIcon from '~/components/icons/PlusIcon'

const tagClassName = 'bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center'
const tagButtonClassName = 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 rounded-full flex items-center justify-center'

const EditorTags = forwardRef(({ workingDocument, updateDocument, visible, setVisible }, ref) => {
  const [workingDocumentTags, setWorkingDocumentTags] = useState([]) // temporary

  const inputContainerRef = useRef()
  const inputRef = useRef()

  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const focusInput = () => {
    setInputVisible(true)
    setTimeout(() => inputRef.current.focus(), 0)
  }

  useImperativeHandle(ref, () => ({ focus: focusInput }))

  const commitInput = () => {
    const trimmedInput = inputValue.trim()
    setInputValue('')

    if (trimmedInput.length > 0) {
      setWorkingDocumentTags([...workingDocumentTags, trimmedInput])
      return true
    }

    return false
  }

  const handleInputContainerBlur = event => {
    if (!inputContainerRef.current.contains(event.relatedTarget)) {
      const addedTag = commitInput()
      setInputVisible(false)
      setVisible(addedTag || workingDocumentTags.length > 0)
    }
  }

  const handleInputKeyDown = event => {
    switch (event.key) {
      case 'Tab':
      case 'Enter':
        const addedTag = commitInput()
        if (addedTag) {
          event.preventDefault()
        }
        break

      case 'Backspace':
        if (inputValue.length === 0) {
          setWorkingDocumentTags(workingDocumentTags.slice(0, -1))
        }
        break
    }
  }

  return (
    <div className="narrow mt-3 flex flex-wrap gap-2" style={{ display: visible ? undefined : 'none' }}>
      {workingDocumentTags.map(tag => (
        <div key={tag} className={`${tagClassName} stretch-focus-visible:focus-ring stretch-hover:bg-slate-200 dark:stretch-hover:bg-slate-700`}>
          <button type="button" className="px-3 py-1 stretch-target no-focus-ring">{tag}</button>

          <button
            type="button"
            className={`${tagButtonClassName} w-6 h-6 -ml-2 mr-1`}
            onClick={() => {
              const remainingTags = workingDocumentTags.filter(t => t !== tag)
              setWorkingDocumentTags(remainingTags)
              setVisible(remainingTags.length > 0)
            }}
          >
            <CloseIcon size="1.5em" ariaLabel="Remove tag" />
          </button>
        </div>
      ))}

      <button
        type="button"
        className={`${tagClassName} ${tagButtonClassName} w-8 h-8`}
        style={{
          display: inputVisible ? 'none' : undefined,
        }}
        onClick={focusInput}
      >
        <PlusIcon size="1.5em" ariaLabel="Add tag" />
      </button>

      <div
        ref={inputContainerRef}
        onBlur={handleInputContainerBlur}
        className="h-8 flex items-center"
      >
        <input
          ref={inputRef}
          type="text"
          className="no-focus-ring bg-transparent"
          style={{
            display: inputVisible ? undefined : 'none',
          }}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type to add tag"
        />
      </div>
    </div>
  )
})

export default EditorTags
