import React from 'react'

import { useContext } from 'lib/context'
import DocumentsStream from 'lib/streams/DocumentsStream'

import LoadAsync from 'components/LoadAsync'

const LoadDocument = props => {
  const { projectId } = useContext()

  return (
    <LoadAsync
      dependenciesRequiringClear={[props.id]}

      provider={(resolve, reject) => {
        const subscription = DocumentsStream(projectId).show(props.id, {}, resolve)
        return () => subscription.unsubscribe()
      }}

      success={props.success}
      loading={props.loading}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load document:</strong> An unexpected error occurred
          </div>
        )
      }} />
  )
}

export default LoadDocument
