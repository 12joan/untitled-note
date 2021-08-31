import React from 'react'

import { useContext } from 'lib/context'

import ContentHeader from 'components/layout/ContentHeader'
import LoadDocument from 'components/documents/LoadDocument'

const ShowDocument = props => {
  const { keyword } = useContext()

  return (
    <div className="p-3">
      <div className="mb-3">
        <ContentHeader />
      </div>

      <LoadDocument
        id={props.id}
        editorProps={doc => ({
          document: {
            ...doc,
            keywords: (doc.blank && keyword !== undefined)
              ? [...doc.keywords, keyword]
              : doc.keywords,
          },
        })} />
    </div>
  )
}

export default ShowDocument
