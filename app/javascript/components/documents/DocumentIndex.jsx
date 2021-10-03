import React from 'react'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import useLocalStorage from 'react-use-localstorage'

import { useContext } from 'lib/context'
import useCounter from 'lib/useCounter'
import DocumentsStream from 'lib/streams/DocumentsStream'

import ContentHeader from 'components/layout/ContentHeader'
import NavLink from 'components/NavLink'
import DocumentIndexSortButton from 'components/documents/DocumentIndexSortButton'
import LoadAsync from 'components/LoadAsync'
import LoadDocument from 'components/documents/LoadDocument'
import { DocumentGridTile, DocumentGridTilePlaceholder } from 'components/documents/DocumentGridTile'
import RunOnMount from 'components/RunOnMount'

const DocumentIndex = forwardRef((props, ref) => {
  const { projectId, keywordId, keyword } = useContext()

  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')
  const [showPages, incrementShowPages] = useCounter(1)
  const [lastPageLoaded, setLastPageLoaded] = useState(false)
  const [bottomReached, setBottomReached] = useState(false)
  const [lastPageIsEmpty, setLastPageIsEmpty] = useState(false)

  const indexParams = {
    query: { id: true },
    keyword_id: keywordId,
    sort_by: sortParameter,
    per_page: 12,
  }

  useImperativeHandle(ref, () => ({
    onScrollToBottom: () => setBottomReached(true),
  }))

  useEffect(() => {
    if (lastPageLoaded && bottomReached && !lastPageIsEmpty) {
      showNextPage()
    }
  }, [lastPageLoaded, bottomReached, lastPageIsEmpty])

  const showNextPage = () => {
    setLastPageLoaded(false)
    setBottomReached(false)
    incrementShowPages()
  }

  const viewDropdownLabel = (keywordId === undefined)
    ? 'All Documents'
    : keyword.text

  return (
    <div className="p-3">
      <div className="mb-3">
        <ContentHeader
          middle={
            <NavLink
              params={{ keywordId, documentId: undefined }}
              className="text-decoration-none"
              style={{ fontWeight: 500 }}>
              {viewDropdownLabel}
            </NavLink>
          }
          right={
            <DocumentIndexSortButton
              sortParameter={sortParameter}
              setSortParameter={setSortParameter} />
          } />
      </div>

      <div className="grid">
        {
          [...Array(showPages).keys()].map(i => i + 1).map(pageNumber => (
            <LoadAsync
              key={pageNumber}

              dependencies={[sortParameter]}
              dependenciesRequiringClear={[projectId, keywordId]}

              provider={(resolve, reject) => {
                const subscription = DocumentsStream(projectId).index({ ...indexParams, page: pageNumber }, resolve)
                return () => subscription.unsubscribe()
              }}

              loading={() => <></>}

              success={documents => (
                <>
                  <RunOnMount onMount={() => {
                    if (pageNumber === showPages) {
                      setLastPageLoaded(true)
                      setLastPageIsEmpty(documents.length === 0)
                    }
                  }} dependencies={[documents]} />

                  {
                    documents.map(doc => (
                      <LoadDocument
                        key={doc.id}
                        id={doc.id}

                        loading={() => <DocumentGridTilePlaceholder />}

                        success={doc => (
                          <DocumentGridTile doc={doc} />
                        )} />
                    ))
                  }
                </>
              )} />
          ))
        }
      </div>

      {
        !lastPageIsEmpty && (
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-light rounded-pill"
              disabled={!lastPageLoaded}
              onClick={showNextPage}>
              Load More
            </button>
          </div>
        )
      }
    </div>
  )
})

export default DocumentIndex
