import React from 'react'

import { useContext, ContextProvider } from 'lib/context'

import RunOnMount from 'components/RunOnMount'

const KeywordContextProvider = props => {
  const { keywordId, keywords, setParams } = useContext()

  if (keywordId === undefined) {
    return props.children
  }

  const currentKeyword = keywords.filter(keyword =>
    keyword.id == keywordId // '==' for lax equality checking
  )[0]

  if (currentKeyword === undefined) {
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
