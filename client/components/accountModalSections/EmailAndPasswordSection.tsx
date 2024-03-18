import React, { useState } from 'react';
import { resetPassword } from '~/lib/apis/resetPassword';
import { handleResetPasswordError } from '~/lib/handleErrors';
import { createToast } from '~/lib/toasts';
import { ReplaceWithSpinner } from '~/components/ReplaceWithSpinner';

export const EmailAndPasswordSection = () => {
  const [sendingResetPasswordEmail, setSendingResetPasswordEmail] =
    useState(false);

  const handleResetPassword = () => {
    setSendingResetPasswordEmail(true);

    handleResetPasswordError(resetPassword())
      .then(() =>
        createToast({
          title: 'Reset password email sent',
          message:
            'Check your inbox for a password reset link. It may take a few minutes to arrive.',
          autoClose: 'fast',
        })
      )
      .finally(() => setSendingResetPasswordEmail(false));
  };

  return (
    <div className="space-y-2">
      <h4 className="h3 select-none">Reset password</h4>

      <p>You will receive an email with a link to reset your password.</p>

      <button
        type="button"
        className="btn btn-rect btn-modal-secondary"
        disabled={sendingResetPasswordEmail}
        onClick={handleResetPassword}
      >
        <ReplaceWithSpinner
          isSpinner={sendingResetPasswordEmail}
          spinnerAriaLabel="Sending reset password email"
        >
          Send reset password email
        </ReplaceWithSpinner>
      </button>
    </div>
  );
};
