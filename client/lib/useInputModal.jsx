import React, { useRef, useEffect } from 'react'

import useModal from '~/lib/useModal'
import useNormalizedInput from '~/lib/useNormalizedInput'

import { ModalTitle } from '~/components/Modal'

const useInputModal = (staticProps = {}) => {
  const [modal, openModal] = useModal(InputModal)

  const openInputModal = (dynamicProps = {}) => openModal({
    ...staticProps,
    ...dynamicProps,
  })

  return [modal, openInputModal]
}

const InputModal = ({
  title,
  inputLabel,
  inputPlaceholder,
  confirmLabel,
  cancelLabel = 'Cancel',
  initialValue = '',
  normalizeInput = value => value.trim(),
  autoSelect = false,
  onConfirm,
  onClose,
}) => {
  const inputRef = useRef()

  const { value, props } = useNormalizedInput({
    initial: initialValue,
    normalize: normalizeInput,
  })

  useEffect(() => {
    if (autoSelect) {
      inputRef.current.select()
    }
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    onClose()
    onConfirm(value)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ModalTitle children={title} />

      <label className="block space-y-2">
        <div className="font-medium select-none">
          {inputLabel}
        </div>

        <input
          ref={inputRef}
          type="text"
          {...props}
          required
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder={inputPlaceholder}
        />
      </label>

      <div className="flex justify-end space-x-2">
        <button type="button" className="btn btn-rect btn-modal-secondary" onClick={onClose}>
          {cancelLabel}
        </button>

        <button type="submit" className="btn btn-rect btn-primary">
          {confirmLabel}
        </button>
      </div>
    </form>
  )
}

export default useInputModal
