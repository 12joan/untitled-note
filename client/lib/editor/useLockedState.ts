import { useCallback } from 'react';
import { createToast } from '~/lib/toasts';
import { LocalDocument } from '~/lib/types';
import { useOverrideable } from '~/lib/useOverrideable';

export const useLockedState = (workingDocument: LocalDocument) => {
  const isLocked = workingDocument.locked_at !== null;
  const [isReadOnly, overrideReadOnly] = useOverrideable(isLocked);

  const temporarilyUnlock = useCallback(() => {
    if (!isReadOnly) return;

    overrideReadOnly(false);

    createToast({
      title: 'Temporarily unlocked document',
      message: 'The document will remain locked when you leave this page',
      autoClose: 'fast',
    });
  }, [isReadOnly]);

  const resumeLock = useCallback(() => overrideReadOnly(true), []);

  return {
    isLocked,
    isReadOnly,
    temporarilyUnlock,
    resumeLock,
  };
};
