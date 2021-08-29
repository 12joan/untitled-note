import React from 'react'

import useRemountKey from 'lib/useRemountKey'
import useVirtualEvent from 'lib/useVirtualEvent'
import { ContextProvider } from 'lib/context'

const InitializeContext = props => {
  const [documentIndexKey, reloadDocumentIndex] = useRemountKey()
  const [pinnedDocumentsKey, reloadPinnedDocuments] = useRemountKey()
  const toggleSidebarEvent = useVirtualEvent()

  return (
    <ContextProvider
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
