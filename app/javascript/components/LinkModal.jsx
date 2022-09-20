import React, { useState } from 'react'

import { ModalTitle } from '~/components/Modal'

const LinkModal = ({ resolve, reject, initialText = '', initialUrl = '' }) => {
  const [url, setUrl] = useState(initialUrl)
  const [text, setText] = useState(initialText)

  const handleSubmit = event => {
    event.preventDefault()
    const textOrUrl = text.trim() === '' ? url : text
    resolve({ url, text: textOrUrl })
  }

  const normalizeUrl = () => {
    if (url.trim() !== '' && url.match(/^[^:]+\./)) {
      setUrl(`https://${url}`)
    }
  }

  const action = initialUrl === '' ? 'Add link' : 'Edit link'

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ModalTitle>{action}</ModalTitle>

      <label className="block space-y-2">
        <div className="font-medium select-none">Text</div>

        <input
          type="text"
          value={text}
          onChange={event => setText(event.target.value)}
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="Optional"
        />
      </label>

      <label className="block space-y-2">
        <div className="font-medium select-none">Link</div>

        <input
          type="url"
          value={url}
          required
          onChange={event => setUrl(event.target.value)}
          onBlur={normalizeUrl}
          onKeyDown={event => event.key === 'Enter' && normalizeUrl()}
          pattern="(https?|mailto|tel|web\+):.*"
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="https://example.com/"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="px-6 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
          onClick={() => reject()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800"
        >
          {action}
        </button>
      </div>
    </form>
  )
}

export default LinkModal
