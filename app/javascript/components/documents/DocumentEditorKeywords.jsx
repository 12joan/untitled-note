import React from 'react'
import ReactTags from 'react-tag-autocomplete'
import { X as Cross } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import NavLink from 'components/NavLink'

const DocumentEditorKeywords = props => {
  const { keywords: allKeywords } = useContext()

  const keywordToTag = keyword => ({
    id: keyword.id,
    name: keyword.text,
  })

  const tagToKeyword = tag => ({
    text: tag.name,
  })

  const tags = props.keywords.map(keywordToTag)

  const setTags = mapFunction => props.updateDocument({
    keywords: mapFunction(tags).map(tagToKeyword),
  })

  const transformKeywordText = text => (
    text.trim().replaceAll(/[ ]{2,}/g, ' ')
  )

  const tagAlreadySelected = tag => (
    props.keywords.some(keyword => keyword.text === transformKeywordText(tag.name))
  )

  const suggestions = allKeywords.map(keywordToTag).filter(tag => !tagAlreadySelected(tag))

  return (
    <ReactTags
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

      onAddition={tag => (
        setTags(tags => ([
          ...tags,
          {
            ...tag,
            name: transformKeywordText(tag.name),
          },
        ]))
      )}

      onDelete={index => (
        setTags(tags => {
          let newTags = tags.slice(0)
          newTags.splice(index, 1)
          return newTags
        })
      )}

      tagComponent={Tag} />
  )
}

const Tag = props => (
  <div className="keyword-tag d-inline-block position-relative rounded-pill p-1 me-2 text-primary">
    <span className="mx-1">
      {props.tag.name}
    </span>

    <NavLink
      className="stretched-link"
      params={{ keywordId: props.tag.id, documentId: undefined }} />

    <button
      className="btn-delete position-relative border-0 p-0 rounded-circle text-primary"
      style={{ width: '1.2em', height: '1.2em', zIndex: 2 }}
      onClick={props.onDelete}
      title={props.removeButtonText}>
      <Cross className="bi" />
      <span className="visually-hidden">{props.removeButtonText}</span>
    </button>
  </div>
)

export default DocumentEditorKeywords
