import React from 'react'
import useLocalStorage from 'react-use-localstorage'

import useRemountKey from 'lib/useRemountKey'
import useVirtualEvent from 'lib/useVirtualEvent'
import { ContextProvider } from 'lib/context'

const InitializeContext = props => {
  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')
  const [documentIndexKey, reloadDocumentIndex] = useRemountKey()
  const [pinnedDocumentsKey, reloadPinnedDocuments] = useRemountKey()
  const toggleSidebarEvent = useVirtualEvent()

  return (
    <ContextProvider
      sortParameter={sortParameter}
      setSortParameter={setSortParameter}
      documentIndexKey={documentIndexKey}
      reloadDocumentIndex={reloadDocumentIndex}
      pinnedDocumentsKey={pinnedDocumentsKey}
      reloadPinnedDocuments={reloadPinnedDocuments}
      toggleSidebarEvent={toggleSidebarEvent}>
      {props.children}
    </ContextProvider>
  )
}

export default InitializeContext
