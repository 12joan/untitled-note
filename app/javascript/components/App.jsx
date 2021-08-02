import React from 'react'
import { useState, useEffect } from 'react'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/DocumentEditor'

const App = props => {
  const [existingDocuments, setExistingDocuments] = useState(undefined)

  useEffect(() => DocumentsAPI.index().then(setExistingDocuments), [])

  return (
    <div className="vh-100">
      <div className="h-100 d-flex">
        <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-3">
          <div>
            {
              existingDocuments === undefined
                ? <>Loading&hellip;</>
                : existingDocuments.map(({ id }) => (
                  <div key={id} className="py-4">
                    <DocumentEditor id={id} />
                  </div>
                ))
            }

            <div className="py-4">
              <DocumentEditor fullHeight />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
