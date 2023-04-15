import fetchAPIEndpoint from '~/lib/fetchAPIEndpoint';

const ResetPasswordAPI = {
  resetPassword: () =>
    fetchAPIEndpoint({
      method: 'POST',
      url: () => '/auth/reset_password',
    }).then((response) => response.json()),
};

export default ResetPasswordAPI;
