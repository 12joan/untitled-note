import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { SettingsSchema } from '~/lib/settingsSchema';

export const fetchSettings = () =>
  fetchAPIEndpoint({
    path: `/api/v1/settings`,
  }).then((response) => response.json()) as Promise<unknown>;

export const updateSettings = (settings: SettingsSchema) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/settings`,
    data: {
      settings: {
        data: JSON.stringify(settings),
      },
    },
  });
