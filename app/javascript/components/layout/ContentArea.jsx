import React from 'react'
import { useRef } from 'react'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'

import { useContext, ContextProvider } from 'lib/context'

import ShowDocument from 'components/documents/ShowDocument'
import DocumentIndex from 'components/documents/DocumentIndex'

const ContentArea = props => {
  const context = useContext()
  const view = buildView(context)
  const viewRef = useRef()

  const scrollContainer = useBottomScrollListener(
    () => viewRef.current?.onScrollToBottom?.(),
    {
      triggerOnNoScroll: true,
      debounce: 0,
      offset: 400,
    },
  )

  return (
    <ContextProvider view={view}>
      <div ref={scrollContainer} className="flex-grow-1 overflow-auto bg-light" style={{ scrollPaddingBottom: '3rem' }}>
        {renderView(view, viewRef)}
      </div>
    </ContextProvider>
  )
}

const buildView = context => {
  if (context.documentId === undefined) {
    return {
      type: 'index',
    }
  }

  return {
    type: 'show',
    documentId: context.documentId,
  }
}

const renderView = (view, ref) => {
  switch (view.type) {
    case 'index':
      return <DocumentIndex ref={ref} />

    case 'show':
      return <ShowDocument ref={ref} id={view.documentId} />

    default:
      return null
  }
}

export default ContentArea
