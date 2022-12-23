import React, { useState } from 'react'

import useModal from '~/lib/useModal'
import { useContext } from '~/lib/context'
import ReplaceAPI from '~/lib/resources/ReplaceAPI'
import { handleReplaceError } from '~/lib/handleErrors'

import { ModalTitle } from '~/components/Modal'
import Tooltip from '~/components/Tooltip'
import ReplaceWithSpinner from '~/components/ReplaceWithSpinner'

const useReplaceModal = () => useModal(ReplaceModal)

const ReplaceModal = ({ documentId, onClose }) => {
  const { projectId } = useContext()

  const [findValue, setFindValue] = useState('')
  const [replaceValue, setReplaceValue] = useState('')
  const findValueIsValid = /[^\s]/.test(findValue)

  const [replaceScope, setReplaceScope] = useState('document')

  const [isReplacing, setIsReplacing] = useState(false)

  const api = ReplaceAPI(projectId)

  const handleReplace = () => {
    const replacePromise = {
      document: options => api.replaceInDocument({ documentId, ...options }),
      project: options => api.replaceInProject(options),
    }[replaceScope]({ find: findValue, replace: replaceValue })

    setIsReplacing(true)

    /* Delay to give the changes time to propagate before returning to the
     * document. If the current document has been changed, the editor will
     * most likely refresh before this anyway, closing the modal.
     */
    handleReplaceError(replacePromise).then(
      () => setTimeout(() => {
        setIsReplacing(false)
        onClose()
      }, 250),
      () => setIsReplacing(false)
    )
  }

  return (
    <div className="space-y-5">
      <ModalTitle>Replace text</ModalTitle>

      <label className="block space-y-2">
        <div className="font-medium select-none">
          Find
        </div>

        <input
          type="text"
          required
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="Find text"
          value={findValue}
          onChange={event => setFindValue(event.target.value)}
        />
      </label>

      <label className="block space-y-2">
        <div className="font-medium select-none">
          Replace
        </div>

        <input
          type="text"
          className="block w-full rounded-lg bg-black/5 focus:bg-white p-2 dark:bg-white/5 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          placeholder="Replace text"
          value={replaceValue}
          onChange={event => setReplaceValue(event.target.value)}
        />
      </label>

      {/* Radio buttons */}
      <div className="block space-y-2">
        <div className="font-medium select-none">
          Find and replace in
        </div>

        {Object.entries({
          document: 'Current document',
          project: 'All documents in project',
        }).map(([value, label]) => (
          <label key={value} className="block space-x-2 select-none">
            <input
              type="radio"
              name="scope"
              checked={replaceScope === value}
              onChange={() => setReplaceScope(value)}
            />

            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" className="btn btn-rect btn-modal-secondary" onClick={onClose}>
          Cancel
        </button>

        <Tooltip content="Find cannot be empty" disabled={findValueIsValid}>
          <div>
            <button
              type="button"
              className="btn btn-rect btn-primary"
              disabled={!findValueIsValid}
              onClick={handleReplace}
            >
              <ReplaceWithSpinner isSpinner={isReplacing} spinnerAriaLabel="Replacing text">
                Replace
              </ReplaceWithSpinner>
            </button>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default useReplaceModal
