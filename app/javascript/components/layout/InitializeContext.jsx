import React from 'react'
import { useRef } from 'react'

import useRemountKey from 'lib/useRemountKey'
import useVirtualEvent from 'lib/useVirtualEvent'
import RecordCache from 'lib/RecordCache'
import { ContextProvider } from 'lib/context'

const InitializeContext = props => {
  const [documentIndexKey, reloadDocumentIndex] = useRemountKey()
  const [pinnedDocumentsKey, reloadPinnedDocuments] = useRemountKey()
  const toggleSidebarEvent = useVirtualEvent()
  const loadDocumentCache = useRef(new RecordCache()).current

  return (
    <ContextProvider
      documentIndexKey={documentIndexKey}
      reloadDocumentIndex={reloadDocumentIndex}
      pinnedDocumentsKey={pinnedDocumentsKey}
      reloadPinnedDocuments={reloadPinnedDocuments}
      toggleSidebarEvent={toggleSidebarEvent}
      loadDocumentCache={loadDocumentCache}>
      {props.children}
    </ContextProvider>
  )
}

export default InitializeContext
