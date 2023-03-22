import React, { createContext, useContext as reactUseContext, useRef, useEffect, useState, useMemo } from 'react'
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

import useModal from '~/lib/useModal'
import { useContext } from '~/lib/context'
import useNormalizedInput from '~/lib/useNormalizedInput'
import { restoreSelection } from '~/lib/editor/selectionAndScrollManagement'

import Tippy from '~/components/Tippy'
import Tooltip from '~/components/Tooltip'
import { ModalTitle } from '~/components/Modal'
import OpenInNewTabIcon from '~/components/icons/OpenInNewTabIcon'
import EditIcon from '~/components/icons/EditIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const isLinkInSelection = editor => someNode(editor, { match: { type: ELEMENT_LINK } })

const LinkModalContext = createContext(null)
const useOpenLinkModal = () => reactUseContext(LinkModalContext)

const useLinkModalProvider = ({ onClose }) => {
  const [modal, openModal] = useModal(LinkModal, { onClose })

  const withLinkModalProvider = children => (
    <>
      {modal}

      <LinkModalContext.Provider
        value={openModal}
        children={children}
      />
    </>
  )

  return withLinkModalProvider
}

const useToggleLink = editor => {
  const openModal = useOpenLinkModal()

  const toggleLink = () => {
    if (isLinkInSelection(editor)) {
      unwrapLink(editor)
    } else {
      openModal({
        initialText: getSelectionText(editor),
        onConfirm: args => insertLink(editor, args),
      })
    }
  }

  return toggleLink
}

const LinkComponent = ({ editor, nodeProps, attributes, children }) => {
  const [selectedLink, selectedLinkPath] = getAboveNode(editor, { match: { type: ELEMENT_LINK } }) || [undefined, undefined]
  const selected = useSelected() && selectedLink !== undefined

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

  const openModal = useOpenLinkModal()

  const editLink = () => {
    const { url } = selectedLink
    const text = getEditorString(editor, selectedLinkPath)

    openModal({
      initialText: text === url ? '' : text,
      initialUrl: url,
      onConfirm: args => upsertLink(editor, args),
    })
  }

  const removeLink = () => unwrapLink(editor)

  return (
    <span {...attributes}>
      <Tippy
        placement="top"
        visible={selected}
        appendTo={document.body}
        interactive
        render={attrs => selected && (
          <div className="rounded-lg backdrop-blur shadow text-base slate-popover" {...attrs} contentEditable={false}>
            <Tooltip content="Open link">
              <button
                type="button"
                className="p-3 rounded-l-lg bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 text-primary-500 dark:text-primary-400"
                onClick={openLink}
              >
                <OpenInNewTabIcon size="1.25em" ariaLabel="Open link" />
              </button>
            </Tooltip>

            <Tooltip content="Edit link">
              <button
                type="button"
                className="p-3 bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 text-primary-500 dark:text-primary-400"
                onClick={editLink}
              >
                <EditIcon size="1.25em" ariaLabel="Edit link" />
              </button>
            </Tooltip>

            <Tooltip content="Remove link">
              <button
                type="button"
                className="p-3 rounded-r-lg bg-slate-100/75 dark:bg-slate-700/75 hocus:bg-slate-200/75 dark:hocus:bg-slate-800/75 text-red-500 dark:text-red-400"
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
          className="btn btn-link"
          children={children}
        />
      </Tippy>
    </span>
  )
}

const LinkModal = ({ onConfirm, onClose, initialText = '', initialUrl = '' }) => {
  const textInputRef = useRef()
  const urlInputRef = useRef()

  useEffect(() => {
    (initialText.trim().length > 0 ? urlInputRef : textInputRef).current.focus()
  }, [])

  const [text, setText] = useState(initialText)

  const { value: url, props: urlProps } = useNormalizedInput({
    initial: initialUrl,
    normalize: url => (url.trim() !== '' && url.match(/^[^:]+\./)) ? `https://${url}` : url,
  })

  const handleSubmit = event => {
    event.preventDefault()
    const textOrUrl = text.trim() === '' ? url : text
    onClose()
    onConfirm({ url, text: textOrUrl })
  }

  const action = initialUrl === '' ? 'Add link' : 'Edit link'

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ModalTitle>{action}</ModalTitle>

      <label className="block space-y-2">
        <div className="font-medium select-none">Text</div>

        <input
          ref={textInputRef}
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
          ref={urlInputRef}
          type="url"
          {...urlProps}
          required
          data-test="hello"
          pattern="(https?|mailto|tel|web\+):.*"
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="https://example.com/"
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="btn btn-rect btn-modal-secondary"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-rect btn-primary"
        >
          {action}
        </button>
      </div>
    </form>
  )
}

export {
  useLinkModalProvider,
  isLinkInSelection,
  useToggleLink,
  LinkComponent,
}
