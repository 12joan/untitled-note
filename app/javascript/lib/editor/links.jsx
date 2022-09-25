import React, { useState, useMemo } from 'react'
import { useSelected } from 'slate-react'
import {
  someNode,
  getAboveNode,
  unwrapLink,
  insertLink,
  upsertLink,
  getSelectionText,
  getEditorString,
  ELEMENT_LINK,
} from '@udecode/plate-headless'

import openModal from '~/lib/openModal'
import { useContext } from '~/lib/context'
import useNormalizedInput from '~/lib/useNormalizedInput'

import Tippy from '~/components/Tippy'
import Tooltip from '~/components/Tooltip'
import { ModalTitle } from '~/components/Modal'
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon'
import EditIcon from '~/components/icons/EditIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const isLinkInSelection = editor => someNode(editor, { match: { type: ELEMENT_LINK } })

const toggleLink = editor => {
  if (isLinkInSelection(editor)) {
    unwrapLink(editor)
  } else {
    openModal(LinkModal, {
      initialText: getSelectionText(editor),
    }, args => insertLink(editor, args))
  }
}

const LinkComponent = ({ editor, nodeProps, children }) => {
  const [selectedLink, selectedLinkPath] = getAboveNode(editor, { match: { type: ELEMENT_LINK } }) || [undefined, undefined]
  const selected = useSelected() && selectedLink !== undefined

  const { tippyContainerRef } = useContext()

  const safeHref = useMemo(() => {
    const unsafeHref = nodeProps.href
    const url = new URL(unsafeHref)

    if (url.protocol === 'javascript:') {
      return 'about:blank'
    }

    return url.href
  }, [nodeProps.href])

  const linkProps = {
    href: safeHref,
    rel: 'noopener noreferrer',
    target: '_blank',
  }

  const openLink = () => Object.assign(document.createElement('a'), linkProps).click()

  const editLink = () => {
    const { url } = selectedLink
    const text = getEditorString(editor, selectedLinkPath)

    openModal(LinkModal, {
      initialText: text === url ? '' : text,
      initialUrl: url,
    }, args => upsertLink(editor, args))
  }

  const removeLink = () => unwrapLink(editor)

  return (
    <Tippy
      placement="top"
      visible={selected}
      interactive
      appendTo={tippyContainerRef.current}
      render={attrs => selected && (
        <div className="rounded-lg backdrop-blur shadow text-ui text-base" {...attrs}>
          <Tooltip content="Open link">
            <button
              type="button"
              className="p-3 rounded-l-lg bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75"
              onClick={openLink}
            >
              <OpenInNewTabIcon size="1.25em" ariaLabel="Open link" />
            </button>
          </Tooltip>

          <Tooltip content="Edit link">
            <button
              type="button"
              className="p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75"
              onClick={editLink}
            >
              <EditIcon size="1.25em" ariaLabel="Edit link" />
            </button>
          </Tooltip>

          <Tooltip content="Remove link">
            <button
              type="button"
              className="p-3 rounded-r-lg bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75"
              onClick={removeLink}
            >
              <DeleteIcon size="1.25em" ariaLabel="Remove link" />
            </button>
          </Tooltip>
        </div>
      )}
    >
      <a
        {...linkProps}
        className="cursor-pointer"
        children={children}
      />
    </Tippy>
  )
}

const LinkModal = ({ onConfirm, onClose, initialText = '', initialUrl = '' }) => {
  const [text, setText] = useState(initialText)

  const [url, urlProps] = useNormalizedInput(initialUrl, url => (url.trim() !== '' && url.match(/^[^:]+\./))
    ? `https://${url}`
    : url
  )

  const handleSubmit = event => {
    event.preventDefault()
    const textOrUrl = text.trim() === '' ? url : text
    onConfirm({ url, text: textOrUrl })
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
          {...urlProps}
          required
          pattern="(https?|mailto|tel|web\+):.*"
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="https://example.com/"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="px-6 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
          onClick={onClose}
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

export {
  isLinkInSelection,
  toggleLink,
  LinkComponent,
}
