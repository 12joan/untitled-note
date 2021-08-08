import React from 'react'
import useLocalStorage from 'react-use-localstorage'

import { ContextProvider } from 'lib/context'

const SortParameterContextProvider = props => {
  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')

  return (
    <ContextProvider sortParameter={sortParameter} setSortParameter={setSortParameter}>
      {props.children}
    </ContextProvider>
  )
}

export default SortParameterContextProvider
