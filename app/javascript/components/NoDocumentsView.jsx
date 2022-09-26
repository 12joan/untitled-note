import React from 'react'

import useNewDocument from '~/lib/useNewDocument'

import NewDocumentIcon from '~/components/icons/NewDocumentIcon'

const NoDocumentsView = () => {
  const createNewDocument = useNewDocument()

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5">
      <h3 className="text-xl font-medium select-none mb-1">No documents yet</h3>

      <p className="text-lg font-light select-none mb-3">Create a new document to get started</p>

      <button
        type="button"
        className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800 flex gap-2 items-center"
        onClick={createNewDocument}
      >
        <NewDocumentIcon size="1.25em" noAriaLabel />

        New document
      </button>
    </div>
  )
}

export default NoDocumentsView
