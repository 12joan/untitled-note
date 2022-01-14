import React from 'react'
import { useState } from 'react'

import { useContext } from 'lib/context'

import ContentHeader from 'components/layout/ContentHeader'
import LoadDocument from 'components/documents/LoadDocument'
import LoadingPlaceholder from 'components/LoadingPlaceholder'
import DocumentEditor from 'components/documents/DocumentEditor'

const ShowDocument = props => {
  const { keyword } = useContext()

  const [footerEl] = useState(() => document.createElement('div'))

  return (
    <>
      <div className="layout-column flex-grow-1 position-relative overflow-auto bg-white p-3" style={{ scrollPaddingTop: '1rem', scrollPaddingBottom: '1rem' }}>
        <div className="mb-2"><ContentHeader /></div>

        <div className="layout-column flex-grow-1">
          <LoadDocument
            id={props.id}

            loading={() => (
              <LoadingPlaceholder className="flex-grow-1" />
            )}

            success={doc => (
              <DocumentEditor
                document={{
                  ...doc,
                  keywords: (doc.blank && keyword !== undefined)
                    ? [...doc.keywords, keyword]
                    : doc.keywords,
                }}
                footerEl={footerEl} />
            )} />
        </div>
      </div>

      <div ref={footerRef => footerRef?.appendChild(footerEl)} />
    </>
  )
}

export default ShowDocument
