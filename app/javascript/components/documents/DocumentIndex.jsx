import React from 'react'
import { useState, useEffect, useImperativeHandle } from 'react'
import { useRef } from 'react'
import useLocalStorage from 'react-use-localstorage'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'

import { useContext } from 'lib/context'
import useCounter from 'lib/useCounter'
import useTitle from 'lib/useTitle'
import DocumentsStream from 'lib/streams/DocumentsStream'

import ContentHeader from 'components/layout/ContentHeader'
import NavLink from 'components/NavLink'
import DocumentIndexSortButton from 'components/documents/DocumentIndexSortButton'
import LoadAsync from 'components/LoadAsync'
import LoadingPlaceholder from 'components/LoadingPlaceholder'
import LoadDocument from 'components/documents/LoadDocument'
import { DocumentGridTile, DocumentGridTilePlaceholder } from 'components/documents/DocumentGridTile'
import RunOnMount from 'components/RunOnMount'

const DocumentIndex = props => {
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

  const viewTitle = (keywordId === undefined)
    ? 'All Documents'
    : keyword.text

  useTitle(viewTitle, { layer: 2 })

  const scrollContainer = useBottomScrollListener(
    () => setBottomReached(true),
    {
      triggerOnNoScroll: true,
      debounce: 0,
      offset: 400,
    },
  )

  return (
    <div ref={scrollContainer} className="flex-grow-1 overflow-auto p-3">
      <div className="mb-3">
        <ContentHeader
          middle={
            <NavLink
              params={{ keywordId, documentId: undefined }}
              className="text-decoration-none"
              style={{ fontWeight: 500 }}>
              {viewTitle}
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

              loading={() => <LoadingPlaceholder className="g-col-12" />}

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
        (lastPageLoaded && !lastPageIsEmpty) && (
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-light rounded-pill"
              onClick={showNextPage}>
              Load More
            </button>
          </div>
        )
      }
    </div>
  )
}

export default DocumentIndex
