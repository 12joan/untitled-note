import { DependencyList, useEffect, useState } from 'react';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import { ToastWithoutId } from '~/lib/types';

const getRandomId = () => Math.random().toString(36).slice(2);

export const createToast = ({ id = getRandomId(), ...toast }: ToastWithoutId) =>
  dispatchGlobalEvent('toast:upsert', { id, ...toast });

export const closeToast = (id: string) =>
  dispatchGlobalEvent('toast:close', id);

export const reopenToast = (id: string) =>
  dispatchGlobalEvent('toast:reopen', id);

export type UseToastOptions = {
  toastDeps: DependencyList;
  reopenDeps?: DependencyList;
};

export const useToast = (
  toast: Omit<ToastWithoutId, 'id'> | null,
  { toastDeps, reopenDeps = [] }: UseToastOptions
) => {
  const [id] = useState(getRandomId);

  useEffect(() => {
    if (toast) {
      createToast({ id, ...toast });
    } else {
      closeToast(id);
    }
  }, toastDeps);

  useEffect(() => {
    if (toast) {
      reopenToast(id);
    }
  }, reopenDeps);
};
