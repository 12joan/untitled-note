import React from 'react'

import { useContext, ContextProvider } from 'lib/context'

import RunOnMount from 'components/RunOnMount'

const KeywordContextProvider = props => {
  const { keywordId, keywords, setParams } = useContext()

  const currentKeyword = keywordId === undefined
    ? undefined
    : keywords.find(keyword =>
      keyword.id == keywordId // '==' for lax equality checking
    )

  if (keywordId !== undefined && currentKeyword === undefined) {
    return (
      <RunOnMount onMount={() => setParams({ keywordId: undefined, documentId: undefined })} />
    )
  }

  return (
    <ContextProvider keyword={currentKeyword}>
      {props.children}
    </ContextProvider>
  )
}

export default KeywordContextProvider
