import React from 'react'
import { useRef, useEffect } from 'react'
import ReactTags from 'react-tag-autocomplete'
import { X as Cross } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import NavLink from 'components/NavLink'

const DocumentEditorKeywords = props => {
  const { keywords: allKeywords, reloadKeywords } = useContext()

  const reactTags = useRef()

  const keywordToTag = keyword => ({
    id: keyword.id,
    name: keyword.text,
  })

  const tagToKeyword = tag => ({
    text: tag.name,
  })

  const tags = props.doc.keywords.map(keywordToTag)

  const setTags = mapFunction => props.updateDocument({
    keywords: mapFunction(tags).map(tagToKeyword),
  })

  const transformKeywordText = text => (
    text.trim().replaceAll(/[ ]{2,}/g, ' ')
  )

  const tagAlreadySelected = tag => (
    props.doc.keywords.some(keyword => keyword.text === transformKeywordText(tag.name))
  )

  const suggestions = allKeywords.map(keywordToTag).filter(tag => !tagAlreadySelected(tag))

  const autoSelectFirstItem = () => {
    const currentIndex = reactTags.current.state.index

    if (currentIndex === -1) {
      reactTags.current.setState({
        index: 0,
      })
    } else if (currentIndex === undefined) {
      console.error('Breaking change: ReactTags.state no longer contains index')
    }
  }

  const afterAddition = ({ localRecord, remoteRecord }) => {
    reloadKeywords()

    props.updateDocument({
      keywords: localRecord.keywords.map(oldKeyword => {
        const newKeyword = remoteRecord.keywords.find(keyword => keyword.text === oldKeyword.text)

        if (oldKeyword.id === undefined && newKeyword !== undefined) {
          return newKeyword
        } else {
          return oldKeyword
        }
      }),
    }, false)
  }

  const afterDelete = () => {
    reloadKeywords()
  }

  useEffect(() => {
    const inputEl = reactTags.current.input?.current?.input?.current

    if (inputEl === undefined) {
      console.error('Breaking change: Cannot find input element of ReactTags')
    }

    const onKeydown = event => {
      if (event.key === 'Tab' && inputEl.value === '') {
        // Prevent ReactTags from interrupting the tab
        event.stopPropagation()
      }
    }

    inputEl.addEventListener('keydown', onKeydown)

    return () => inputEl.removeEventListener('keydown', onKeydown)
  }, [])

  return (
    <ReactTags
      ref={reactTags}
      tags={tags}
      suggestions={suggestions}
      minQueryLength={1}
      placeholderText="Add keywords..."
      removeButtonText="Remove keyword"
      noSuggestionsText="Keyword not found"
      newTagText="New keyword:"
      allowNew

      onValidate={tag => (
        /[^\s]+/.test(tag.name) && !tagAlreadySelected(tag)
      )}

      onAddition={tag => {
        setTags(tags => ([
          ...tags,
          {
            ...tag,
            name: transformKeywordText(tag.name),
          },
        ]))
          .then(afterAddition)
      }}

      onDelete={index => {
        setTags(tags => {
          let newTags = tags.slice(0)
          newTags.splice(index, 1)
          return newTags
        })
          .then(afterDelete)
      }}

      onInput={autoSelectFirstItem}
      onFocus={autoSelectFirstItem}

      tagComponent={options => <Tag {...options} readOnly={props.readOnly} />} />
  )
}

const Tag = props => (
  <div className="keyword-tag d-inline-block position-relative rounded-pill p-1 me-2 my-1 text-primary">
    <NavLink
      className="stretched-link text-decoration-none mx-1"
      params={{ keywordId: props.tag.id, documentId: undefined }}>
      {props.tag.name}
    </NavLink>

    <button
      className="btn-delete position-relative border-0 p-0 rounded-circle text-primary"
      style={{ width: '1.2em', height: '1.2em', zIndex: 2 }}
      onClick={props.onDelete}
      disabled={props.readOnly}
      title={props.removeButtonText}>
      <Cross className="bi" />
      <span className="visually-hidden">{props.removeButtonText}</span>
    </button>
  </div>
)

export default DocumentEditorKeywords
