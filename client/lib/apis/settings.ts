import { streamAction } from '~/channels/dataChannel';
import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import type { Settings } from '~/lib/types';

export const streamSettings = (callback: (settings: Settings) => void) =>
  streamAction('Settings', 'show', {}, callback);

export const updateSettings = (settings: Partial<Settings>) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: '/api/v1/settings',
    data: {
      settings,
    },
  });
