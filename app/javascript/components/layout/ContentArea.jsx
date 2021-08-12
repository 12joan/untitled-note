import React from 'react'

import { useContext, ContextProvider } from 'lib/context'

import ContentHeader from 'components/layout/ContentHeader'
import ShowDocument from 'components/documents/ShowDocument'
import DocumentIndex from 'components/documents/DocumentIndex'

const ContentArea = props => {
  const context = useContext()
  const view = buildView(context)

  return (
    <ContextProvider view={view}>
      <ContentHeader />

      <div className="flex-grow-1 overflow-auto bg-light">
        {renderView(view)}
      </div>
    </ContextProvider>
  )
}

const buildView = context => {
  if (context.documentId === undefined) {
    return {
      type: 'index',
      deleted: false,
    }
  }

  if (context.documentId === 'deleted') {
    return {
      type: 'index',
      deleted: true,
    }
  }

  return {
    type: 'show',
    documentId: context.documentId,
  }
}

const renderView = view => {
  switch (view.type) {
    case 'index':
      return <DocumentIndex deletedOnly={view.deleted} />

    case 'show':
      return <ShowDocument id={view.documentId} />

    default:
      return null
  }
}

export default ContentArea
