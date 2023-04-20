import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';

export const resetPassword = () => fetchAPIEndpoint({
  method: 'POST',
  path: '/auth/reset_password',
});
