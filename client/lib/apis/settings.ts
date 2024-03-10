import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { Settings } from '~/lib/types';

import { streamAction } from '~/channels/dataChannel';

export const streamSettings = (callback: (settings: Settings) => void) =>
  streamAction('Settings', 'show', {}, callback);

export const updateSettings = (settings: Partial<Settings>) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/settings`,
    data: {
      settings,
    },
  });
