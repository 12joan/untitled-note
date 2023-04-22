import { dispatchGlobalEvent } from '~/lib/globalEvents';
import { Toast } from '~/lib/types';

export const createToast = (toast: Toast) =>
  dispatchGlobalEvent('toast', toast);
