import React, { useState } from 'react'

import useModal from '~/lib/useModal'
import { handleResetPasswordError } from '~/lib/handleErrors'
import ResetPasswordAPI from '~/lib/resources/ResetPasswordAPI'

import { ModalTitleWithCloseButton } from '~/components/Modal'
import ReplaceWithSpinner from '~/components/ReplaceWithSpinner'

const useAccountModal = () => useModal(AccountModal, {
  customPanelClassNames: {
    spacing: 'space-y-3',
  },
})

const AccountModal = ({ onClose }) => {
  const [sendingResetPasswordEmail, setSendingResetPasswordEmail] = useState(false)

  const handleResetPassword = () => {
    setSendingResetPasswordEmail(true)

    handleResetPasswordError(ResetPasswordAPI.resetPassword())
      .finally(() => setSendingResetPasswordEmail(false))
  }

  return (
    <>
      <ModalTitleWithCloseButton onClose={onClose}>
        Account info
      </ModalTitleWithCloseButton>

      <div className="space-y-2">
        <h3 className="text-lg font-medium select-none">
          Reset password
        </h3>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          Click the button below to reset your password. You will receive an email with a link to reset your password.
        </div>

        <button
          type="button"
          className="btn btn-rect btn-modal-secondary"
          disabled={sendingResetPasswordEmail}
          onClick={handleResetPassword}
        >
          <ReplaceWithSpinner isSpinner={sendingResetPasswordEmail} spinnerAriaLabe="Sending reset password email">
            Send reset password email
          </ReplaceWithSpinner>
        </button>
      </div>
    </>
  )
}

export default useAccountModal
