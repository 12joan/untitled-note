import React from 'react'

import { useContext } from 'lib/context'

import ContentHeader from 'components/layout/ContentHeader'
import LoadDocument from 'components/documents/LoadDocument'
import DocumentPlaceholder from 'components/documents/DocumentPlaceholder'
import DocumentEditor from 'components/documents/DocumentEditor'

const ShowDocument = props => {
  const { keyword } = useContext()

  return (
    <div className="p-3 d-flex flex-column" style={{ minHeight: '100%' }}>
      <div className="mb-3">
        <ContentHeader />
      </div>

      <LoadDocument
        id={props.id}

        loading={() => (
          <DocumentPlaceholder fullHeight />
        )}

        success={doc => (
          <DocumentEditor
            document={doc}
            keywords={
              (doc.blank && keyword !== undefined)
                ? [...doc.keywords, keyword]
                : doc.keywords
            }
            fullHeight />
        )} />
    </div>
  )
}

export default ShowDocument
